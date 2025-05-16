// src/lib/api/auth.js
import Cookies from 'js-cookie';
import { fetcher } from '@/lib/fetcher';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const NEXT_PUBLIC_JWT_AUTH_URL = process.env.NEXT_PUBLIC_JWT_AUTH_URL;

export async function loginUser(username, password) {
  const res = await fetcher(`${NEXT_PUBLIC_JWT_AUTH_URL}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');

  const token = data.token;
  setToken(token); // ✅ Only token is stored in cookie
  const user = await getUserProfile(token); // always fetched fresh

  return { token, user };
}




export function setToken(token) {
  Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });
}

export function getToken() {

  console.log('Cookies', Cookies.get('token'));
  return Cookies.get('token');
}

export function removeToken() {
  Cookies.remove('token');
}

export async function register(username, email, password) {
  const res = await fetcher(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return res.json();
}

export function logout() {
  if (typeof window !== 'undefined') {
    removeToken();

    // Clear all cookies (if needed)
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
  }
  return { success: true };
}

export async function getUserProfile(token) {
  try {
    const res = await fetcher(`${API_BASE_URL}/users/me?context=edit`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.error) {
      throw new Error(res.error);
    }
    return res;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return { error: error.message };
  }
}

export async function updateUserProfile(userId, data, token) {
  const res = await fetcher(`${API_BASE_URL}/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
}


// src/lib/auth.js
export async function socialLogin(provider, idToken) {
  const res = await fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/community/v1/social-login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, id_token: idToken })
    }
  );
  if (!res.ok) throw new Error('Social login failed');
  return res.json(); // => { token: '…', user: { … } }
}
