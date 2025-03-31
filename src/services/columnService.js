import { fetchWithErrorHandling } from './apiService';

const API_URL = 'http://localhost:3000/api/columns';

export const getColumns = async (boardId) => {
  const token = localStorage.getItem('token');
  return fetchWithErrorHandling(`${API_URL}?boardId=${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createColumn = async (boardId, title) => {
  const token = localStorage.getItem('token');
  return fetchWithErrorHandling(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ boardId, title }),
  });
};

export const updateColumn = async (id, newTitle) => {
  const token = localStorage.getItem('token');
  return fetchWithErrorHandling(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newTitle }),
  });
};

export const deleteColumn = async (id) => {
  const token = localStorage.getItem('token');
  return fetchWithErrorHandling(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default { getColumns, createColumn, updateColumn, deleteColumn };
