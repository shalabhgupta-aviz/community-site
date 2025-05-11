// ✅ src/lib/api/topics.js
import { API_BASE_URL } from './config';

export async function getTopics() {
  const res = await fetch(`${API_BASE_URL}/forum/`);
  return res.json();
}

export async function getTopicDetails(id) {
  const res = await fetch(`${API_BASE_URL}/forum/${id}`);
  return res.json();
}

export async function getTopic(id) {
  const res = await fetch(`${API_BASE_URL}/topic/${id}`);
  return res.json();
}

export async function createTopic(title, content, token) {
  const res = await fetch(`${API_BASE_URL}/topic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return res.json();
}

export async function updateTopic(id, data, token) {
  const res = await fetch(`${API_BASE_URL}/topic/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTopic(id, token) {
  const res = await fetch(`${API_BASE_URL}/topic/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return res.json();
}
