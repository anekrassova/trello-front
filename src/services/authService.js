const API_URL = 'http://localhost:3000/api/auth';

const register = async (email, password) => {
  const REGISTER_URL = `${API_URL}/register`;
  const response = await fetch(REGISTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка регистрации.');
  }

  return data;
};

const login = async (email, password) => {
  const LOGIN_URL = `${API_URL}/login`;
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка входа.');
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data.user;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const getToken = () => {
  return localStorage.getItem('token');
};

const authService = { register, login, logout, getCurrentUser, getToken };
export default authService;
