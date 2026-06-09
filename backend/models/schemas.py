from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class TutorRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, Any]]] = None


class TutorResponse(BaseModel):
    response: str


class NotesRequest(BaseModel):
    topic: str


class NotesResponse(BaseModel):
    notes: str


class QuizRequest(BaseModel):
    topic: str


class QuizResponse(BaseModel):
    quiz: Dict[str, Any]


class StudyPlanRequest(BaseModel):
    goal: str


class StudyPlanResponse(BaseModel):
    plan: Dict[str, Any]


class CareerGuidanceRequest(BaseModel):
    interest_area: str


class CareerGuidanceResponse(BaseModel):
    roadmap: Dict[str, Any]


class ResearchAssistantRequest(BaseModel):
    topic: str


class ResearchAssistantResponse(BaseModel):
    output: Dict[str, Any]
