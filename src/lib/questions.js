// src/lib/questions.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Get all questions under a topic
export async function getQuestionsOfTopic(id) {
  const response = await fetch(`${API_BASE_URL}/topic?parent=${id}`);
  return response.json();
}

// Get single question detail by ID
export async function getQuestionDetails(questionId) {
  const response = await fetch(`${API_BASE_URL}/topic/${questionId}`);
  return response.json();
}
