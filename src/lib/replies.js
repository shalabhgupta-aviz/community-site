// src/lib/api/replies.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Get replies of a specific question
export async function getRepliesForQuestion(questionId) {
  const response = await fetch(`${API_BASE_URL}/reply?parent=${questionId}`);
  return response.json();
}

// ✅ Get replies for each question in a topic (includes latest reply)
export async function getLatestRepliesInTopic(topicId) {
  const response = await fetch(`${API_BASE_URL}/topic?parent=${topicId}`);
  const questions = await response.json();

  const enriched = await Promise.all(
    questions.map(async (question) => {
      const repliesRes = await fetch(`${API_BASE_URL}/reply?parent=${question.id}`);
      const replies = await repliesRes.json();

      if (replies?.length > 0) {
        const sorted = replies.sort((a, b) => new Date(b.date) - new Date(a.date));
        question.latest_reply = sorted[0].content.rendered;
      } else {
        question.latest_reply = null;
      }
      return question;
    })
  );

  return enriched;
}

// ✅ Get replies directly from a topic
export async function getReplyOfTopic(topicId) {
  const response = await fetch(`${API_BASE_URL}/reply?parent=${topicId}`);
  return response.json();
}

// ✅ Create a new reply
export async function createReply(topicId, content, token) {
  const response = await fetch(`${API_BASE_URL}/reply?parent=${topicId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return response.json();
}

// ✅ Update a reply
export async function updateReply(replyId, content, token) {
  const response = await fetch(`${API_BASE_URL}/reply/${replyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return response.json();
}

// ✅ Delete a reply
export async function deleteReply(replyId, token) {
  const response = await fetch(`${API_BASE_URL}/reply/${replyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
