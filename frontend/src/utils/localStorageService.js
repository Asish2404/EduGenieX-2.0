const KEYS = {
  NOTES: 'edugenieX_notes',
  QUIZ: 'edugenieX_quiz',
  PLAN: 'edugenieX_study_plan',
  TUTOR: 'edugenieX_tutor_history',
  CAREER: 'edugenieX_career_plans',
  RESEARCH: 'edugenieX_research_history',
  PROFILE: 'edugenieX_profile',
};

export const saveNotes = (notes) => {
  localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
};

export const getNotes = () => {
  const saved = localStorage.getItem(KEYS.NOTES);
  return saved ? JSON.parse(saved) : null;
};

export const saveQuiz = (quiz) => {
  localStorage.setItem(KEYS.QUIZ, JSON.stringify(quiz));
};

export const getQuiz = () => {
  const saved = localStorage.getItem(KEYS.QUIZ);
  return saved ? JSON.parse(saved) : null;
};

export const saveStudyPlan = (plan) => {
  localStorage.setItem(KEYS.PLAN, JSON.stringify(plan));
};

export const getStudyPlan = () => {
  const saved = localStorage.getItem(KEYS.PLAN);
  return saved ? JSON.parse(saved) : null;
};

export const saveTutorHistory = (history) => {
  localStorage.setItem(KEYS.TUTOR, JSON.stringify(history));
};

export const getTutorHistory = () => {
  const saved = localStorage.getItem(KEYS.TUTOR);
  return saved ? JSON.parse(saved) : [];
};

export const saveCareerPlans = (career) => {
  localStorage.setItem(KEYS.CAREER, JSON.stringify(career));
};

export const getCareerPlans = () => {
  const saved = localStorage.getItem(KEYS.CAREER);
  return saved ? JSON.parse(saved) : null;
};

export const saveResearchHistory = (research) => {
  localStorage.setItem(KEYS.RESEARCH, JSON.stringify(research));
};

export const getResearchHistory = () => {
  const saved = localStorage.getItem(KEYS.RESEARCH);
  return saved ? JSON.parse(saved) : null;
};

export const saveProfile = (profile) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getProfile = () => {
  const saved = localStorage.getItem(KEYS.PROFILE);
  return saved ? JSON.parse(saved) : { name: '', college: '', program: '', semester: '' };
};

export const getStats = () => ({
  tutorConversations: getTutorHistory().length,
  notesGenerated: getNotes() ? 1 : 0,
  quizGenerated: getQuiz() ? 1 : 0,
  plansCreated: getStudyPlan() ? 1 : 0,
  careerPlansCreated: getCareerPlans() ? 1 : 0,
  researchQueries: getResearchHistory() ? 1 : 0,
});