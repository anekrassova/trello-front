import { toast } from 'react-toastify';

export const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      switch (response.status) {
        case 401:
          toast.error('Ошибка 401: Авторизация требуется');
          break;
        case 404:
          toast.error('Ресурс не найден');
          break;
        case 505:
          toast.error('Ошибка сервера. Повторите попытку позже.');
          break;
        default:
          toast.error(`Ошибка: ${response.status} ${response.statusText}`);
      }
      throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError') {
      toast.error('Ошибка сети. Повторите попытку позже.');
    } else {
      toast.error(error.message);
    }
    throw error;
  }
};
