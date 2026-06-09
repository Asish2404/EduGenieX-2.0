from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.tutor import router as tutor_router
from routes.notes import router as notes_router
from routes.quiz import router as quiz_router
from routes.study_plan import router as study_plan_router
from routes.career import router as career_router
from routes.research import router as research_router

app = FastAPI(title="EduGenie X Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tutor_router, prefix="/api")
app.include_router(notes_router, prefix="/api")
app.include_router(quiz_router, prefix="/api")
app.include_router(study_plan_router, prefix="/api")
app.include_router(career_router, prefix="/api")
app.include_router(research_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}
