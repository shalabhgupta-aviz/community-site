// src/lib/questions.js

import { fetcher } from "./fetcher";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Get all questions under a topic
export async function getQuestionsOfTopic(id) {
  const response = await fetcher(`${API_BASE_URL}/topic?forum_id=${id}&per_page=5`);
  console.log('response', response);
  return response;
}

// Get single question detail by ID with 5 latest replies
export async function getQuestionDetails(questionId) {
  const response = await fetcher(`${process.env.NEXT_PUBLIC_API_URL_V1}/topic/${questionId}`);
  console.log('questionId', questionId);
  console.log('response', response);
  return response;
}

export async function getQuestions(page = 1, perPage = 10) {
  const response = await fetcher(`${API_BASE_URL}/topic?per_page=${perPage}&page=${page}`);
  return response;
}


export async function createQuestion(forumId, title, content, token, question_tag) {
  const res = await fetcher(`${API_BASE_URL}/topic`, {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
      status: 'publish',
      forum_id: forumId,
      topic_tag: question_tag,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create question');
  }

  return res;
}