from fastapi import APIRouter
from models.schemas import ResearchAssistantRequest, ResearchAssistantResponse
from services.gemini_service import generate_research_assistant_response

router = APIRouter()

@router.post("/research", response_model=ResearchAssistantResponse)
async def research_assistant(req: ResearchAssistantRequest):
    return await generate_research_assistant_response(req.topic)