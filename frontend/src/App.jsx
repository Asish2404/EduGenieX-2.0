import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx'
import AITutorPage from './pages/AITutorPage.jsx'
import NotesGeneratorPage from './pages/NotesGeneratorPage.jsx'
import QuizGeneratorPage from './pages/QuizGeneratorPage.jsx'
import StudyPlannerPage from './pages/StudyPlannerPage.jsx'
import CareerGuidancePage from './pages/CareerGuidancePage.jsx'
import ResearchAssistantPage from './pages/ResearchAssistantPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tutor" element={<AITutorPage />} />
        <Route path="/notes" element={<NotesGeneratorPage />} />
        <Route path="/quiz" element={<QuizGeneratorPage />} />
        <Route path="/planner" element={<StudyPlannerPage />} />
        <Route path="/career" element={<CareerGuidancePage />} />
        <Route path="/research" element={<ResearchAssistantPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
