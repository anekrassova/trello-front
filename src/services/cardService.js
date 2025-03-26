const API_URL = 'http://localhost:3000/api/cards';

export const getCards = async (columnId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${columnId}/cards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error while loading cards.');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export const createCard = async (title, column, description, position) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, column, description, position }),
    });

    if (!response.ok) throw new Error('Error while creating card.');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export const updateCard = async (id, updates) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Error while updating card.');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export const deleteCard = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error while deleting card.');
  } catch (error) {
    console.error(error.message);
  }
};

const cardService = { getCards, createCard, updateCard, deleteCard };
export default cardService;
