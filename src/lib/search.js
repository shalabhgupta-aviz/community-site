// src/lib/search.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Search for topics matching a query
 * @param {string} query - The search string
 * @returns {Promise<Array>} - List of matching topics
 */
export async function searchTopics(query) {
  const response = await fetch(`${API_BASE_URL}/search/topics?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search topics');
  return response.json();
}

/**
 * Search for users matching a query
 * @param {string} query - The search string
 * @returns {Promise<Array>} - List of matching users
 */
export async function searchUsers(query) {
  const response = await fetch(`${API_BASE_URL}/search/users?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search users');
  return response.json();
}
