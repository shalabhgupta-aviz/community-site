import Cookies from 'js-cookie';

// Constants
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Token management
export function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// User data management
export function setUser(user) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

// export function getUser() {
//   if (typeof window !== 'undefined') {
//     const user = localStorage.getItem(USER_KEY);
//     return user ? JSON.parse(user) : null;
//   }
//   return null;
// }

export function removeUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}

// Auth state checks
export function isAuthenticated() {
  return getToken() !== null;
}

// Logout helper
export function logout() {
  removeToken();
  removeUser();
}

// Login helper
export function handleLogin(data) {
  Cookies.set('token', data.token, { expires: 7 });
  localStorage.setItem('user', JSON.stringify(data));
}

export function logoutUser() {
  Cookies.remove('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export function isLoggedIn() {
  return !!Cookies.get('token');
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}