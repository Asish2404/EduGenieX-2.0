"""
OpenRouter text-generation service.

Mirrors the surface of the previous Gemini service: a single function
`generate_text(prompt)` that returns a plain string. Retry / fallback
behaviour is owned by the caller (see services/gemini_service.py).

Uses only the Python standard library (urllib) so no new dependencies
need to be added to requirements.txt.
"""

import json
import urllib.error
import urllib.request
from typing import Any, Dict

from config import settings


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
REQUEST_TIMEOUT_SECONDS = 60


class OpenRouterError(Exception):
    """Raised for any non-recoverable OpenRouter failure (non-2xx, bad JSON, etc.)."""


def _post_json(url: str, payload: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    for k, v in headers.items():
        req.add_header(k, v)

    try:
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT_SECONDS) as resp:
            body = resp.read().decode("utf-8")
            status = resp.status
    except urllib.error.HTTPError as e:
        # Surface upstream status code + body for diagnosis.
        body = e.read().decode("utf-8", errors="replace") if e.fp else ""
        raise OpenRouterError(f"HTTP {e.code}: {body}") from e
    except urllib.error.URLError as e:
        raise OpenRouterError(f"URLError: {e.reason}") from e

    if status < 200 or status >= 300:
        raise OpenRouterError(f"HTTP {status}: {body}")

    try:
        return json.loads(body)
    except json.JSONDecodeError as e:
        raise OpenRouterError(f"Invalid JSON in response: {body[:200]}") from e


def generate_text(prompt: str) -> str:
    """
    Send a single user-turn prompt to OpenRouter and return the assistant text.

    Diagnostics (mirrors what was added to the Gemini service):
      * active model
      * whether the API key is present
      * first 200 chars of the response
      * the exact exception on failure
    """
    print("OPENROUTER MODEL:", settings.openrouter_model)
    print("OPENROUTER API KEY FOUND:", bool(settings.openrouter_api_key))
    print("OPENROUTER KEY PREFIX:", settings.openrouter_api_key[:15] if settings.openrouter_api_key else "EMPTY")

    if not settings.openrouter_api_key:
        raise OpenRouterError("OPENROUTER_API_KEY is not set")

    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
        # OpenRouter recommends these for attribution / ranking.
        "HTTP-Referer": "https://edugeniex.local",
        "X-Title": "EduGenie X",
    }
    payload = {
        "model": settings.openrouter_model,
        "messages": [
            {"role": "user", "content": prompt},
        ],
    }

    data = _post_json(OPENROUTER_URL, payload, headers)

    # OpenRouter response shape:
    # {"choices": [{"message": {"role": "assistant", "content": "..."}}], ...}
    try:
        text = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as e:
        raise OpenRouterError(f"Unexpected response shape: {json.dumps(data)[:200]}") from e

    if not isinstance(text, str) or not text.strip():
        raise OpenRouterError(f"Empty assistant content: {json.dumps(data)[:200]}")

    print("OPENROUTER RESPONSE:", text[:200])
    return text
