// src/lib/api/replies.js

import { fetcher } from "./fetcher";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Get replies of a specific question
// src/lib/replies.js

export async function getRepliesForQuestion(questionId) {
  const res = await fetcher(`${API_BASE_URL}/reply?topic_id=${questionId}&per_page=10`);
  if (res.error) throw new Error(res.error || 'Failed to fetch replies');
  return res;
}

// ✅ Get replies directly from a topic
export async function getReplyOfTopic(topicId) {
  const response = await fetcher(`${API_BASE_URL}/reply?parent=${topicId}`);
  if (response.error) throw new Error(response.error || 'Failed to fetch replies for topic');
  return response;
}

// ✅ Create a new bbPress reply
export async function createReply(topicId, content, token) {
  const res = await fetcher(`${process.env.NEXT_PUBLIC_API_URL_V1}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content,        // the body of the reply
      parent: topicId, // topic ID the reply belongs to
      status: 'publish'
    }),
  });

  if (res.error) {
    throw new Error(res.error || 'Failed to create reply');
  }
  return res;
}

// ✅ Update a reply
export async function updateReply(replyId, content, token) {
  const response = await fetcher(`${API_BASE_URL}/reply/${replyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (response.error) throw new Error(response.error || 'Failed to update reply');
  return response;
}

// ✅ Delete a reply
export async function deleteReply(replyId, token) {
  const response = await fetcher(`${API_BASE_URL}/reply/${replyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.error) throw new Error(response.error || 'Failed to delete reply');
  return response;
}

// ✅ Get recent replies
export async function getRecentReplies() {
  const replies = await fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/community/v1/recent-replies`
  );
  if (replies.error) throw new Error(replies.error || 'Failed to fetch recent replies');
  return replies;
} 