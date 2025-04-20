import { fetchWithErrorHandling } from './apiService';

const API_URL = 'http://localhost:3000/api/columns';

export const getColumns = async (boardId) => {
  const token = localStorage.getItem('token');

  const response = await fetchWithErrorHandling(
    `${API_URL}?boardId=${boardId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (Array.isArray(response.data)) {
    response.data.sort((a, b) => a.position - b.position);
  }

  return response;
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

export const reorderColumns = async (boardId, orderedColumnIds) => {
  const token = localStorage.getItem('token');
  //console.log('Sending reorderColumns with:', boardId, orderedColumnIds);
  return fetchWithErrorHandling(`http://localhost:3000/api/columns/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ boardId, orderedColumnIds }),
  });
};

export default {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
};
