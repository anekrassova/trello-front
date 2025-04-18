import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../style/BoardPage.module.css';

import Header from './Header';
import Sidebar from './Sidebar';
import Column from './Column';

import authService from '../services/authService';
import {
  setBoards,
  removeBoard,
  fetchBoards,
  createBoard
} from '../actions/boardAction';
import {
  fetchColumns,
  createColumn,
  deleteColumn,
  editColumn
} from '../actions/columnAction';
import {
  fetchTasks,
  createTask,
  deleteTask,
  editTask
} from '../actions/cardAction';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const BoardPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = authService.getCurrentUser();
  const boards = useSelector((state) => state.boards);
  const columnsByBoard = useSelector((state) => state.columnsByBoard);
  const tasksByBoard = useSelector((state) => state.tasksByBoard);

  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (id) {
      dispatch(fetchBoards());
      dispatch(fetchColumns(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (columnsByBoard[id]) {
      dispatch(fetchTasks(id, columnsByBoard[id]));
    }
  }, [dispatch, id, columnsByBoard]);

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    dispatch(createColumn(id, newColumnTitle));
    setNewColumnTitle('');
  };

  const handleDragEnd = (result) => {
    const { source, destination, type, draggableId } = result;
    if (!destination) return;

    if (type === 'TASK') {
      const sourceCol = source.droppableId.replace('column-', '');
      const destCol = destination.droppableId.replace('column-', '');

      if (sourceCol === destCol && source.index === destination.index) return;

      dispatch({
        type: 'MOVE_TASK',
        payload: {
          boardId: id,
          sourceColumnId: sourceCol,
          destColumnId: destCol,
          sourceIndex: source.index,
          destIndex: destination.index,
          draggableId,
        },
      });
    }

    if (type === 'COLUMN') {
      if (source.index === destination.index) return;

      dispatch({
        type: 'MOVE_COLUMN',
        payload: {
          boardId: id,
          sourceIndex: source.index,
          destIndex: destination.index,
        },
      });
    }
  };

  const columns = columnsByBoard[id] || [];

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Sidebar
          boards={boards}
          setBoards={setBoards}
          onCreateBoard={(title) => dispatch(createBoard(title))}
          onDeleteBoard={(id) => dispatch(removeBoard(id))}
        />
        <div className={styles.content}>
          <div className={styles.newColumnForm}>
            <input
              type="text"
              placeholder="New column name"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
            />
            <button onClick={handleAddColumn}>+</button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="columns"
              direction="horizontal"
              type="COLUMN"
            >
              {(provided) => (
                <div
                  className={styles.columns}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {columns.map((column, index) => {
                    const draggableId = `column-${column.id}`;
                    console.log('Rendering Draggable:', draggableId);

                    return (
                      <Draggable
                        key={column.id}
                        draggableId={draggableId}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <div {...provided.dragHandleProps}>
                              <Column
                                column={column}
                                boardId={id} // ⬅ передаём напрямую
                                tasks={tasksByBoard[id]?.[column.id] || []}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </>
  );
};

export default BoardPage;
