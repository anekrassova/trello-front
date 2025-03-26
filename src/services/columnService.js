const API_URL = 'http://localhost:3000/api/columns';

export const getColumns = async (boardId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}?boardId=${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error while loading columns.');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export const createColumn = async (boardId, title) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ boardId, title }),
    });

    if (!response.ok) throw new Error('Error while creating column.');

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export const updateColumn = async (id, newTitle) => {
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

    if (!response.ok) throw new Error('Error while updating column.');

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export const deleteColumn = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error while deleting column.');
  } catch (error) {
    console.error(error.message);
  }
};

const columnService = { getColumns, createColumn, updateColumn, deleteColumn };
export default columnService;
