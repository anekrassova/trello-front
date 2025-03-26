const API_URL = 'http://localhost:3000/api/boards';

export const getBoards = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error while loading boards.');
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export const createBoard = async (title) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) throw new Error('Error while creating board.');

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export const deleteBoard = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error while deleting board.');
  } catch (error) {
    console.error(error.message);
  }
};

export const updateBoard = async (id, newTitle) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newTitle }),
    });

    if (!response.ok) throw new Error('Error while updating board.');

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const boardService = { getBoards, createBoard, deleteBoard, updateBoard };
export default boardService;
