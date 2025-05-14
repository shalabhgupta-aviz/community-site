// lib/users.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // e.g. https://dev.community.aviznetworks.com/wp-json/wp/v2

export async function getUserByUsername(slug, topicPage = 1, replyPage = 1) {
    const res = await fetch(
      `${API_BASE_URL}/users?slug=${slug}` +
      `&topic_page=${topicPage}&reply_page=${replyPage}`
    )
    const data = await res.json()
    return data[0] || null
}

export async function getTopicsByUser(userId, page = 1, perPage = 10) {
  const res = await fetch(
    `${API_BASE_URL}/topic?author=${userId}&per_page=${perPage}&page=${page}`
  )
  return { items: await res.json(), totalPages: parseInt(res.headers.get('x-wp-totalpages')||'1') }
}

export async function getRepliesByUser(userId, page = 1, perPage = 10) {
  const res = await fetch(
    `${API_BASE_URL}/reply?username=${userId}&per_page=${perPage}&page=${page}`
  )
  return { items: await res.json(), totalPages: parseInt(res.headers.get('x-wp-totalpages')||'1') }
}

export async function updateUserProfile(userData) {
  const token = document.cookie.split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  console.log(token);
  console.log(userData);
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      url: userData.url,
      description: userData.description,
      name: userData.name,
      email: userData.email,
      image: userData.image
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return res.json();
}