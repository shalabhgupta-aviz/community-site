// src/lib/api/auth.js
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const NEXT_PUBLIC_JWT_AUTH_URL = process.env.NEXT_PUBLIC_JWT_AUTH_URL;

export async function loginUser(username, password) {
  const res = await fetch(`${NEXT_PUBLIC_JWT_AUTH_URL}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function register(username, email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return res.json();
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    removeToken();

    // Clear cookies
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
  }
  return { success: true };
}

export async function getUserProfile(token) {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function updateUserProfile(userId, data, token) {
  const res = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Save token
export function setToken(token) {
  Cookies.set('token', token, {
    expires: 7,
    secure: true,
    sameSite: 'Strict',
  });
}

export function getToken() {
  return Cookies.get('token');
}

export function removeToken() {
  Cookies.remove('token');
}
