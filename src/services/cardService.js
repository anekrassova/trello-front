import { fetchWithErrorHandling } from './apiService';

const API_URL = 'http://localhost:3000/api/cards';

export const getCards = async (columnId) => {
  const token = localStorage.getItem('token');
  return fetchWithErrorHandling(`${API_URL}/${columnId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createCard = async (title, column, description, position) => {
  const token = localStorage.getItem('token');
  return fetchWithErrorHandling(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, column, description, position }),
  });
};

export const updateCard = async (id, updates) => {
  const token = localStorage.getItem('token');
  return fetchWithErrorHandling(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
};

export const deleteCard = async (id) => {
  const token = localStorage.getItem('token');
  return fetchWithErrorHandling(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default { getCards, createCard, updateCard, deleteCard };
