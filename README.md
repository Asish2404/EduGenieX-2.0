# 🎓 EduGenieX

AI-powered academic assistant designed to help students learn faster, study smarter, and stay organized.

EduGenieX combines modern AI models with an intuitive user interface to provide tutoring, notes generation, quizzes, study planning, career guidance, and research assistance in a single platform.

---

## 🚀 Features

### 🤖 AI Tutor

Ask academic questions and receive structured explanations, examples, and concept breakdowns.

### 📝 Notes Generator

Generate organized study notes for any topic.

### ❓ Quiz Generator

Create practice quizzes and MCQs to test understanding.

### 📅 Study Planner

Generate personalized study schedules and learning roadmaps.

### 💼 Career Guidance

Receive career recommendations, required skills, project ideas, and preparation strategies.

### 🔬 Research Assistant

Generate research ideas, methodologies, tools, implementation approaches, and project guidance.

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Markdown
* Lucide React

### Backend

* FastAPI
* Python
* Pydantic

### AI Integration

* OpenRouter API
* Nex AGI / OpenRouter-compatible LLMs

---

## 📂 Project Structure

```text
EduGenieX/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── config.py
│   └── main.py
│
├── README.md
└── .gitignore
```

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/Asish2404/EduGenieX.git
cd EduGenieX
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create `.env`

```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=nex-agi/nex-n2-pro:free
```

Run Backend

```bash
uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 📡 API Endpoints

### AI Tutor

```http
POST /api/tutor
```

### Notes Generator

```http
POST /api/notes
```

### Quiz Generator

```http
POST /api/quiz
```

### Study Planner

```http
POST /api/study-plan
```

### Career Guidance

```http
POST /api/career
```

### Research Assistant

```http
POST /api/research
```

---

## 🔒 Environment Variables

Create a `.env` file inside the backend folder:

```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=nex-agi/nex-n2-pro:free
```

Do not commit `.env` files to GitHub.

---

## 🎯 Project Goals

* Improve student productivity
* Provide instant academic assistance
* Support self-learning
* Simplify study planning
* Assist with research and career development

---

## 👨‍💻 Developer

**Asish Bose**

Techno India University

Aspiring Full Stack & AI Developer

---

## 📜 License

This project is developed for educational and learning purposes.

```
```
