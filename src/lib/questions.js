// src/lib/questions.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Get all questions under a topic
export async function getQuestionsOfTopic(id) {
  const response = await fetch(`${API_BASE_URL}/topic?forum_id=${id}&per_page=5`);
  return response.json();
}

// Get single question detail by ID with 5 latest replies
export async function getQuestionDetails(questionId) {
  const response = await fetch(`${API_BASE_URL}/topic/${questionId}`);
  return response.json();
}

export async function getQuestions(page = 1, perPage = 10) {
  const response = await fetch(`${API_BASE_URL}/topic?per_page=${perPage}&page=${page}`);
  return response.json();
}