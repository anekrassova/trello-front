import * as boardService from '../services/boardService';

export const setBoards = (boards) => ({
  type: 'SET_BOARDS',
  payload: boards,
});

export const removeBoard = (id) => ({
  type: 'REMOVE_BOARD',
  payload: id,
});

export const updateBoardInState = (board) => ({
  type: 'UPDATE_BOARD',
  payload: board,
});

export const fetchBoards = () => async (dispatch) => {
  try {
    const boards = await boardService.getBoards();
    //console.log("fetched data:", boards)
    dispatch(setBoards(boards.data));
  } catch (error) {
    console.error('Ошибка при загрузке досок:', error);
  }
};

export const createBoard = (title) => async (dispatch) => {
  try {
    //console.log('клиент отправляет при создании доски: ', title)
    const newBoard = await boardService.createBoard(title);
    dispatch({
      type: 'ADD_BOARD',
      payload: newBoard,
    });
  } catch (error) {
    console.error('Ошибка при добавлении доски:', error);
  }
};

export const deleteBoard = (id) => async (dispatch) => {
  try {
    await boardService.deleteBoard(id);
    dispatch(removeBoard(id));
  } catch (error) {
    console.error('Ошибка при удалении доски:', error);
  }
};

export const updateBoard = (id, newTitle) => async (dispatch) => {
  try {
    const updatedBoard = await boardService.updateBoard(id, newTitle);
    dispatch(updateBoardInState(updatedBoard.data));
  } catch (error) {
    console.error('Ошибка при редактировании доски:', error);
  }
};
