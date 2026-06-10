import axios from 'axios'

import { API_BASE_URL } from '../utils/constants.js'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 8-second timeout for professional response speed
})

export async function tutorChat(payload) {
  return api.post('/tutor', payload)
}

export async function generateNotes(payload) {
  return api.post('/notes', payload)
}

export async function generateQuiz(payload) {
  return api.post('/quiz', payload)
}

export async function generateStudyPlan(payload) {
  return api.post('/study-plan', payload)
}

export async function generateCareerGuidance(payload) {
  return api.post('/career', payload)
}

export async function generateResearchAssistance(payload) {
  return api.post('/research', payload)
}
