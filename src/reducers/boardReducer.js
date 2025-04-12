const boardsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_BOARDS':
      return action.payload;
    case 'ADD_BOARD':
      return [...state, action.payload];
    case 'REMOVE_BOARD':
      return state.filter((board) => board.id !== action.payload);
    case 'UPDATE_BOARD':
      return state.map((board) =>
        board.id === action.payload.id ? action.payload : board
      );
    default:
      return state;
  }
};

export default boardsReducer;
