from fastapi import APIRouter
from models.schemas import StudyPlanRequest, StudyPlanResponse
from services.gemini_service import generate_study_plan_response

router = APIRouter()

@router.post("/study-plan", response_model=StudyPlanResponse)
async def study_plan(req: StudyPlanRequest):
    return await generate_study_plan_response(req.goal)
