const columnReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_COLUMNS':
      return {
        ...state,
        [action.payload.boardId]: action.payload.columns,
      };
    case 'ADD_COLUMN':
      return {
        ...state,
        [action.payload.boardId]: [
          ...state[action.payload.boardId],
          action.payload.column,
        ],
      };
    case 'REMOVE_COLUMN':
      return {
        ...state,
        [action.payload.boardId]: state[action.payload.boardId].filter(
          (column) => column.id !== action.payload.columnId
        ),
      };
    case 'UPDATE_COLUMN':
      return {
        ...state,
        [action.payload.boardId]: state[action.payload.boardId].map((column) =>
          column.id === action.payload.columnId
            ? { ...column, title: action.payload.newTitle }
            : column
        ),
      };
    default:
      return state;
  }
};

export default columnReducer;
