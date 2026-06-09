from fastapi import APIRouter
from models.schemas import TutorRequest, TutorResponse
from services.gemini_service import generate_tutor_response

router = APIRouter()

@router.post("/tutor", response_model=TutorResponse)
async def tutor(req: TutorRequest):
    return await generate_tutor_response(req.message, req.history)
