// src/lib/api/replies.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Get replies of a specific question
// src/lib/replies.js

export async function getRepliesForQuestion(questionId) {
  const res = await fetch(`${API_BASE_URL}/reply?topic_id=${questionId}&per_page=10`);
  if (!res.ok) throw new Error('Failed to fetch replies');
  return res.json();
}



// ✅ Get replies directly from a topic
export async function getReplyOfTopic(topicId) {
  const response = await fetch(`${API_BASE_URL}/reply?parent=${topicId}`);
  return response.json();
}

// ✅ Create a new bbPress reply
export async function createReply(topicId, content, token) {
  const res = await fetch(`${API_BASE_URL}/wp/v2/replies`, {
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

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create reply');
  }
  return res.json();
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


// ✅ Get recent replies
export async function getRecentReplies() {
  const replies = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/community/v1/recent-replies`
  ).then(r => r.json());
  return replies;
}