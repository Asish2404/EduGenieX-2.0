from fastapi import APIRouter
from models.schemas import CareerGuidanceRequest, CareerGuidanceResponse
from services.gemini_service import generate_career_guidance_response

router = APIRouter()

@router.post("/career", response_model=CareerGuidanceResponse)
async def career_guidance(req: CareerGuidanceRequest):
    return await generate_career_guidance_response(req.interest_area)