// src/lib/questions.js

import { fetcher } from "./fetcher";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const V1 = process.env.NEXT_PUBLIC_API_URL_V1

// Get all questions under a topic with pagination
export async function getQuestionsOfTopic(id, page = 1, perPage = 5) {
  const response = await fetcher(`${API_BASE_URL}/topic?forum_id=${id}&per_page=${perPage}&page=${page}`);
  console.log('response', response);
  return response;
}

// Get single question detail by ID with 5 latest replies
export async function getQuestionDetails(questionId, page, perPage, token) {
  const url = `${V1}/topic/${questionId}?per_page=${perPage}&page=${page}`
  // only attach the header if we have a token
  const headers = {};
  console.log('token', url, {
    credentials: 'include',      // send cookies if you’re using WP‐cookie auth
    headers,
  });
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetcher(url, {
    credentials: 'include',      // send cookies if you’re using WP‐cookie auth
    headers,
  }
);
  console.log('response', response);
  return response;
}

export async function getQuestions(page, perPage) {
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

export async function getRecentQuestions(perPage) {
  const res = await fetcher(`${V1}/recent-topics?per_page=${perPage}`);
  return res;
}