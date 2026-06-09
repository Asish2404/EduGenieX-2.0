from fastapi import APIRouter
from models.schemas import NotesRequest, NotesResponse
from services.gemini_service import generate_notes_response

router = APIRouter()

@router.post("/notes", response_model=NotesResponse)
async def notes(req: NotesRequest):
    return await generate_notes_response(req.topic)
