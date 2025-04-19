const cardReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        [action.payload.boardId]: action.payload.tasks,
      };

    case 'ADD_TASK':
      return {
        ...state,
        [action.payload.boardId]: {
          ...state[action.payload.boardId],
          [action.payload.columnId]: [
            ...(state[action.payload.boardId]?.[action.payload.columnId] || []),
            action.payload.task,
          ],
        },
      };

    case 'REMOVE_TASK':
      return {
        ...state,
        [action.payload.boardId]: {
          ...state[action.payload.boardId],
          [action.payload.columnId]: state[action.payload.boardId]?.[
            action.payload.columnId
            ]?.filter((task) => task.id !== action.payload.taskId),
        },
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        [action.payload.boardId]: {
          ...state[action.payload.boardId],
          [action.payload.columnId]: state[action.payload.boardId]?.[
            action.payload.columnId
            ]?.map((task) =>
            task.id === action.payload.taskId
              ? { ...task, ...action.payload.updates }
              : task
          ),
        },
      };

    case 'MOVE_TASK': {
      const {
        boardId,
        sourceColumnId,
        destColumnId,
        sourceIndex,
        destIndex,
      } = action.payload;

      const sourceTasks = [...state[boardId][sourceColumnId]];
      const [movedTask] = sourceTasks.splice(sourceIndex, 1);

      if (sourceColumnId === destColumnId) {
        sourceTasks.splice(destIndex, 0, movedTask);
        return {
          ...state,
          [boardId]: {
            ...state[boardId],
            [sourceColumnId]: sourceTasks,
          },
        };
      }

      const destTasks = [...(state[boardId][destColumnId] || [])];
      destTasks.splice(destIndex, 0, movedTask);

      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          [sourceColumnId]: sourceTasks,
          [destColumnId]: destTasks,
        },
      };
    }

    default:
      return state;
  }
};

export default cardReducer;
