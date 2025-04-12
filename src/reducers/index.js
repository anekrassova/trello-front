import { combineReducers } from 'redux';
import columnReducer from './columnReducer.js';
import cardReducer from './cardReducer.js';
import boardReducer from './boardReducer.js';

const rootReducer = combineReducers({
  columnsByBoard: columnReducer,
  tasksByBoard: cardReducer,
  boards: boardReducer,
});

export default rootReducer;
