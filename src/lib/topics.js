import { fetcher } from "./fetcher";

// ✅ src/lib/api/topics.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const V1 = process.env.NEXT_PUBLIC_API_URL_V1

export async function getTopics() {
  const res = await fetcher(`${API_BASE_URL}/forum/`);
  return res;
}

export async function getTopicDetails(id) {
  const res = await fetcher(`${API_BASE_URL}/forum/${id}`);
  return res;
}

export async function getTopic(id) {
  const res = await fetcher(`${API_BASE_URL}/topic/${id}`);
  return res;
}

export async function createTopic(title, content, token) {
  const res = await fetcher(`${API_BASE_URL}/topic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return res;
}

export async function updateTopic(id, data, token) {
  const res = await fetcher(`${API_BASE_URL}/topic/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res;
}

export async function deleteTopic(id, token) {
  const res = await fetcher(`${API_BASE_URL}/topic/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return res;
}

export async function getRecentTopics(perPage = 10) {
  const res = await fetcher(`${V1}/recent-topics?per_page=${perPage}`);
  return res;
}