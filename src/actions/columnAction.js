import columnService from '../services/columnService';
import board from '../components/Board.jsx';

export const setColumns = (boardId, columns) => ({
  type: 'SET_COLUMNS',
  payload: { boardId, columns },
});

export const fetchColumns = (boardId) => async (dispatch) => {
  console.log(`board id для получения колонок: ${boardId}`)
  const res = await columnService.getColumns(boardId);
  console.log('полученные колoнки: ', res)
  dispatch(setColumns(boardId, res.data));
};

export const createColumn = (boardId, title) => async (dispatch) => {
  console.log(`запрос на создание колонки. boardId: ${boardId}, title: ${title}`)
  const res = await columnService.createColumn(boardId, title);
  dispatch({
    type: 'ADD_COLUMN',
    payload: { boardId, column: res.data },
  });
};

export const deleteColumn = (boardId, columnId) => async (dispatch) => {
  await columnService.deleteColumn(columnId);
  dispatch({
    type: 'REMOVE_COLUMN',
    payload: { boardId, columnId },
  });
};

export const editColumn = (boardId, columnId, newTitle) => async (dispatch) => {
  await columnService.updateColumn(columnId, newTitle);
  dispatch({
    type: 'UPDATE_COLUMN',
    payload: { boardId, columnId, newTitle },
  });
};

export const moveColumn = (boardId, sourceIndex, destIndex) => ({
  type: 'MOVE_COLUMN',
  payload: { boardId, sourceIndex, destIndex },
});