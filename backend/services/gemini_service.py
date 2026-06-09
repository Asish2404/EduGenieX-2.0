import json
import time
import random
import re
from typing import Any, List, Optional

from config import settings
from services.openrouter_service import generate_text as _openrouter_generate_text


def _build_prompt_tutor(message: str, history: Optional[List[dict]] = None) -> str:
    history = history or []
    # Keep history small for demo stability
    last = history[-6:]  # Keep last 3 turns of conversation (user + AI)
    lines = []
    for m in last:
        role = m.get("role", "user")
        content = m.get("content", "")
        lines.append(f"{role.upper()}: {content}")

    context_str = "\n".join(lines).strip()

    if context_str:
        return (
            "You are EduGenie X, an AI academic tutor for college students. "
            "Explain the concept clearly, step-by-step, and include detailed examples. "
            "When helpful, provide brief formulas, pseudocode, or a small snippet.\n\n"
            f"Conversation so far:\n{context_str}\n\n"
            f"Student question: {message}\n\n"
            "Answer in a helpful, structured format."
        )

    return (
        "You are EduGenie X, an AI academic tutor for college students. "
        "Explain the concept clearly, step-by-step, and include examples. "
        "When helpful, provide brief formulas, pseudocode, or a small snippet. Ensure the response is comprehensive and academically rigorous.\n\n"
        f"Student question: {message}\n\n"
        "Answer in a helpful, structured format."
    )


def _safe_json_extract(text: str) -> Any:
    """
    Attempt to extract JSON from model output (handles markdown fences).
    """
    if text is None:
        return None
    s = str(text).strip()

    # Remove common markdown fences
    s = s.replace("```json", "")
    s = s.replace("```", "")

    # If fenced, take inside first fence
    if "```" in s:
        parts = s.split("```")
        # Typically: [before, lang?, json, after]
        for i in range(len(parts) - 1):
            candidate = parts[i + 1].strip()
            if candidate.startswith("{") or candidate.startswith("["):
                try:
                    return json.loads(candidate)
                except Exception:
                    pass

    # Fallback: direct parse
    try:
        return json.loads(s)
    except Exception:
        return None


def _generate_text(prompt: str) -> str:
    return _openrouter_generate_text(prompt)


def _looks_unavailable(err: Exception) -> bool:
    msg = str(err).lower()
    # Keep heuristics small and generic
    return (
        "503" in msg
        or "service unavailable" in msg
        or "unavailable" in msg
        or "rate limit" in msg
        or "429" in msg
        or "network" in msg
    )


def _with_retries(fn, retries: int = 3) -> str:
    """
    Retry Gemini calls on transient/unavailable failures with exponential backoff.
    Last error is raised if all retries fail.
    """
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            return fn()
        except Exception as e:
            last_err = e
            print("OPENROUTER ERROR:", repr(e))
            # Retry only on likely transient/unavailable failures
            if not _looks_unavailable(e):
                raise
            if attempt < retries - 1:
                # Exponential backoff: 2^attempt + random jitter
                sleep_time = (2**attempt) + (random.random() * 0.1)
                time.sleep(sleep_time)
                continue
    assert last_err is not None
    raise last_err


def _fallback_tutor() -> str:
    return (
        "EduGenie X (demo)\n\n"
        "Topic: Learning support\n\n"
        "- Start by breaking the concept into 3 parts: definitions, intuition, and examples.\n"
        "- Use a worked example, then generalize.\n"
        "- When you’re stuck, ask: “What’s the smallest case I can test?”\n"
        "\n"
        "Sample mini-answer structure:\n"
        "1) Definition\n"
        "2) Key idea / intuition\n"
        "3) Example\n"
        "4) Quick practice problem\n"
    )


def _fallback_notes(topic: str) -> str:
    t = topic.strip() or "your topic"
    return (
        f"# Notes (demo): {t}\n\n"
        "## Core Idea\n"
        "- Understand the main concept.\n"
        "- Identify relationships between subtopics.\n\n"
        "## Key Points\n"
        "- Use headings for structure.\n"
        "- Convert text into bullet points.\n\n"
        "## Small Example\n"
        "```python\n"
        "def concept_check(x):\n"
        '    return f"You understood: {x}"\n'
        "```\n\n"
        "## Quick Table\n"
        "| Term | Meaning |\n"
        "|------|---------|\n"
        "| A    | Alpha   |\n"
        "| B    | Beta    |\n"
    )


def _fallback_quiz(topic: str) -> dict:
    t = (topic or "").strip() or "this topic"
    return {
        "questions": [
            {
                "question": f"What is a foundational concept to learn first when studying {t}?",
                "options": [
                    "The most advanced subtopic",
                    "Core definitions and basic terminology",
                    "Edge cases only",
                    "Historical background only",
                ],
                "correct_answer": "Core definitions and basic terminology",
                "explanation": f"Building a strong base of definitions and terminology in {t} helps you reason about harder subtopics later.",
            },
            {
                "question": f"Which study approach works best when revising {t} for an exam?",
                "options": [
                    "Re-reading the chapter once",
                    "Active recall with short practice questions",
                    "Highlighting everything",
                    "Waiting until the night before",
                ],
                "correct_answer": "Active recall with short practice questions",
                "explanation": f"Active recall strengthens memory and exposes gaps in your understanding of {t}.",
            },
            {
                "question": f"When approaching a complex problem in {t}, what is the most effective initial step?",
                "options": [
                    "Jump to the answer",
                    "Identify the given information and what is being asked",
                    "Memorize a template",
                    "Skip to the hardest part",
                ],
                "correct_answer": "Identify the given information and what is being asked",
                "explanation": f"Framing the problem clearly is the first step in any {t} problem-solving process.",
            },
            {
                "question": f"What is a definitive indicator of a deep understanding of {t}?",
                "options": [
                    "You can repeat the textbook word-for-word",
                    "You can explain the idea in your own words and give an example",
                    "You have read it once",
                    "You have watched one video on it",
                ],
                "correct_answer": "You can explain the idea in your own words and give an example",
                "explanation": f"Being able to paraphrase and exemplify shows genuine understanding of {t}.",
            },
            {
                "question": f"Upon completing the foundational concepts of {t}, what is the most productive next step for continued learning?",
                "options": [
                    "Stop studying",
                    "Move on to a new topic",
                    "Practice problems of increasing difficulty and review mistakes",
                    "Read the same chapter again",
                ],
                "correct_answer": "Practice problems of increasing difficulty and review mistakes",
                "explanation": f"Spaced, graded practice with mistake review is the most effective way to master {t}.",
            },
        ]
    }


def _fallback_study_plan() -> dict:
    return {
        "weeks": [
            {
                "week": 1,
                "topics": "Foundational Concepts and Basic Syntax/Terminology",
                "practice_tasks": "Complete introductory exercises, solve 5 basic problems, review key definitions.",
                "deliverables": "Detailed concept notes, glossary of terms, solutions to practice problems.",
                "assessment": "Self-assessment quiz (10 questions), peer review of concept notes.",
            },
            {
                "week": 2,
                "topics": "Intermediate Techniques and Common Patterns/Algorithms",
                "practice_tasks": "Implement 3 medium-difficulty projects, analyze case studies, debug provided code snippets.",
                "deliverables": "Project code with documentation, analysis report of case studies, corrected debugged code.",
                "assessment": "Timed coding challenge (1 hour), short presentation on project implementation.",
            },
            {
                "week": 3,
                "topics": "Advanced Topics, Optimization, and Integration",
                "practice_tasks": "Develop a complex feature, explore performance bottlenecks, integrate with external systems (conceptual).",
                "deliverables": "Advanced feature implementation, performance analysis report, system integration plan.",
                "assessment": "Technical interview simulation, design review of complex feature.",
            },
            {
                "week": 4,
                "topics": "Comprehensive Review and Exam Preparation",
                "practice_tasks": "Solve past exam papers, create flashcards, participate in group discussions, build a summary project.",
                "deliverables": "Annotated past papers, personalized revision guide, summary project demonstration.",
                "assessment": "Full-length mock exam, final project defense.",
            },
        ]
    }


async def generate_tutor_response(message: str, history: Optional[List[dict]] = None):
    prompt = _build_prompt_tutor(message, history)

    # Use a regex to extract the core topic from the message for intelligent fallback
    match = re.search(
        r"(react dom|virtual dom|dbms|operating system|deadlock|computer networks|sql|normalization|oop|dsa|trees|graphs|sorting|searching)",
        message,
        re.IGNORECASE,
    )
    topic_for_fallback = match.group(0) if match else "General Academic Concept"

    try:
        text = _with_retries(lambda: _generate_text(prompt), retries=3)
        return {"response": text}
    except Exception:
        return {"response": _get_tutor_fallback_content(topic_for_fallback)}


async def generate_notes_response(topic: str):
    prompt = (
        "You are EduGenie X. Generate professional study notes for the given topic.\n\n"
        "Requirements:\n"
        "- Use Markdown\n"
        "- The notes must be between 800 and 1200 words.\n"
        "- Include the following headings in order:\n"
        "  # Introduction\n"
        "  # Definition\n"
        "  # Core Concepts\n"
        "  # Working Principle\n"
        "  # Advantages\n"
        "  # Disadvantages\n"
        "  # Examples\n"
        "  # Applications\n"
        "  # Interview Questions\n"
        "  # Semester Exam Questions\n"
        "  # Summary\n\n"
        "Ensure the output is in proper Markdown format, supporting headings (H1, H2, H3), tables, lists, and code blocks where appropriate. "
        "Maintain a professional academic style throughout the notes.\n\n"
        f"Topic: {topic}\n\n"
        "Notes:"
    )
    try:
        text = _with_retries(lambda: _generate_text(prompt), retries=3)
        return {"notes": text}
    except Exception:
        return {"notes": _fallback_notes(topic)}


async def generate_quiz_response(topic: str):
    prompt = (
        "You are EduGenie X. Create a revision quiz on the given topic.\n\n"
        "Return ONLY valid JSON (no markdown). Use this schema:\n"
        "{\n"
        '  "questions": [\n'
        "    {\n"
        '      "question": string,\n'
        '      "options": [string, string, string, string],\n'
        '      "correct_answer": string,\n'
        '      "explanation": string\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Add 5 questions.\n"
        f"Topic: {topic}\n"
    )

    try:
        text = _with_retries(lambda: _generate_text(prompt), retries=3)
        data = _safe_json_extract(text)
        if (
            not isinstance(data, dict)
            or not isinstance(data.get("questions"), list)
            or len(data["questions"]) == 0
        ):
            data = _fallback_quiz(topic)
        return {"quiz": data}
    except Exception:
        return {"quiz": _fallback_quiz(topic)}


async def generate_study_plan_response(goal: str):
    prompt = (
        "You are EduGenie X. Build a study plan timeline for the given goal.\n\n"
        "Return ONLY valid JSON with this schema:\n"
        "{\n"
        '  "weeks": [\n'
        "    {\n"
        '      "week": number or string,\n'
        '      "topics": string,\n'
        '      "practice": string,\n'
        '      "deliverables": string,\n'
        '      "assessment": string\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Assume 4 weeks by default, unless the goal clearly mentions a different duration.\n"
        f"Goal: {goal}\n"
    )

    try:
        text = _with_retries(lambda: _generate_text(prompt), retries=3)
        data = _safe_json_extract(text)
        if data is None:
            data = {"weeks": []}
        return {"plan": data}
    except Exception:
        return {"plan": _fallback_study_plan()}


def _fallback_career_guidance(interest: str) -> dict:
    i = (interest or "").strip() or "your field"
    return {
        "skills": [
            f"Core {i} fundamentals",
            "Problem-solving & analytical thinking",
            "Communication & technical writing",
            "Tools & frameworks used in the industry",
            "Version control (Git) & collaboration",
        ],
        "projects": [
            f"Build a portfolio project demonstrating {i} skills",
            "Contribute to an open-source project in the domain",
            "Complete a capstone or end-to-end case study",
        ],
        "timeline": [
            "Month 1-2: Foundations & core concepts",
            "Month 3-4: Hands-on projects & tools",
            "Month 5-6: Advanced topics & specialization",
            "Month 7+: Portfolio polish & interview prep",
        ],
        "interview_prep": [
            "Practice common technical questions for " + i,
            "Prepare 3-5 STAR behavioral stories",
            "Mock interviews with peers or mentors",
            "Review system design basics (if applicable)",
            "Research target companies & roles",
        ],
    }


def _fallback_research_assistant(topic: str) -> dict:
    t = (topic or "").strip() or "your research topic"
    return {
        "problem_statement": f"Identify key challenges and open questions in {t}. Define the scope and significance of the problem for academic or practical impact.",
        "methodology": f"Literature review of {t}, followed by empirical analysis / experiments / case studies as appropriate. Use qualitative and quantitative methods.",
        "tools": [
            "Google Scholar / Semantic Scholar / IEEE Xplore",
            "Zotero / Mendeley for reference management",
            "Python (pandas, numpy) or R for data analysis",
            "Overleaf / LaTeX for writing",
        ],
        "expected_outcomes": [
            f"Clear understanding of the state of the art in {t}",
            "Identified research gaps and future directions",
            "A draft framework or prototype (if applicable)",
            "A structured report or paper outline",
        ],
        "next_steps": [
            f"Finalize research questions for {t}",
            "Conduct systematic literature review",
            "Design methodology and collect/analyze data",
            "Draft and iterate on the write-up",
        ],
    }


async def generate_career_guidance_response(interest_area: str):
    prompt = (
        "You are EduGenie X. Create a career roadmap for the given interest area.\n\n"
        "Return ONLY valid JSON with this schema:\n"
        "{\n"
        '  "skills": [string],\n'
        '  "projects": [string],\n'
        '  "timeline": [string],\n'
        '  "interview_prep": [string]\n'
        "}\n\n"
        f"Interest Area: {interest_area}\n"
    )

    try:
        text = _with_retries(lambda: _generate_text(prompt), retries=3)
        data = _safe_json_extract(text)
        if not isinstance(data, dict) or not all(
            k in data for k in ("skills", "projects", "timeline", "interview_prep")
        ):
            data = _fallback_career_guidance(interest_area)
        return {"roadmap": data}
    except Exception:
        return {"roadmap": _fallback_career_guidance(interest_area)}


async def generate_research_assistant_response(topic: str):
    prompt = (
        "You are EduGenie X. Create a research assistant output for the given topic.\n\n"
        "Return ONLY valid JSON with this schema:\n"
        "{\n"
        '  "problem_statement": string,\n'
        '  "methodology": string,\n'
        '  "tools": [string],\n'
        '  "expected_outcomes": [string],\n'
        '  "next_steps": [string]\n'
        "}\n\n"
        f"Research Topic: {topic}\n"
    )

    try:
        text = _with_retries(lambda: _generate_text(prompt), retries=3)
        data = _safe_json_extract(text)
        if not isinstance(data, dict) or not all(
            k in data
            for k in (
                "problem_statement",
                "methodology",
                "tools",
                "expected_outcomes",
                "next_steps",
            )
        ):
            data = _fallback_research_assistant(topic)
        return {"output": data}
    except Exception:
        return {"output": _fallback_research_assistant(topic)}


def _get_tutor_fallback_content(topic: str) -> str:
    return f"""
# {topic}

## Definition
{topic} is an important concept in computer science and software engineering.

## Key Concepts
- Understand the core definition
- Learn how it works
- Study practical examples
- Practice exam-oriented questions

## Example
Consider a simple real-world scenario and analyze how {topic} applies.

## Advantages
- Improves conceptual understanding
- Frequently asked in exams
- Useful in interviews

## Summary
Focus on the definition, working principle, examples, advantages, and applications of {topic}.
"""
