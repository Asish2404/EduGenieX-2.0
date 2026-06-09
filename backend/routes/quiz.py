from fastapi import APIRouter
from models.schemas import QuizRequest, QuizResponse
from services.gemini_service import generate_quiz_response

router = APIRouter()

@router.post("/quiz", response_model=QuizResponse)
async def quiz(req: QuizRequest):
    return await generate_quiz_response(req.topic)
