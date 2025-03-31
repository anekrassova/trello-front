import { fetchWithErrorHandling } from './apiService';

const API_URL = 'http://localhost:3000/api/boards';

export const getBoards = async () => {
  return fetchWithErrorHandling(API_URL);
};

export const createBoard = async (title) => {
  return fetchWithErrorHandling(API_URL, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
};

export const deleteBoard = async (id) => {
  return fetchWithErrorHandling(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};

export const updateBoard = async (id, newTitle) => {
  return fetchWithErrorHandling(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ newTitle }),
  });
};

export default { getBoards, createBoard, deleteBoard, updateBoard };
