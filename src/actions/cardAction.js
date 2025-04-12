import cardService from '../services/cardService';

export const setTasks = (boardId, tasks) => ({
  type: 'SET_TASKS',
  payload: { boardId, tasks },
});

export const fetchTasks = (boardId, columnIds) => async (dispatch) => {
  const tasks = {};
  for (const columnId of columnIds) {
    console.log('columnId:', columnId);
    const res = await cardService.getCards(columnId.id);
    console.log('fetched cards: ', res)
    tasks[columnId.id] = res.data;
    console.log(`tasks for column ${columnId.id}: ${tasks[columnId.id]}`)
  }
  dispatch(setTasks(boardId, tasks));
};

export const createTask = (boardId, columnId, taskData) => async (dispatch) => {
  const res = await cardService.createCard(taskData.title, columnId, taskData.description || '', taskData.position || 0);
  dispatch({
    type: 'ADD_TASK',
    payload: { boardId, columnId, task: res.data },
  });
};

export const deleteTask = (boardId, columnId, taskId) => async (dispatch) => {
  await cardService.deleteCard(taskId);
  dispatch({
    type: 'REMOVE_TASK',
    payload: { boardId, columnId, taskId },
  });
};

export const editTask = (boardId, columnId, taskId, updates) => async (dispatch) => {
  await cardService.updateCard(taskId, updates);
  dispatch({
    type: 'UPDATE_TASK',
    payload: { boardId, columnId, taskId, updates },
  });
};
