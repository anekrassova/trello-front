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
  createBoard,
} from '../actions/boardAction';
import {
  fetchColumns,
  createColumn,
  deleteColumn,
  editColumn,
  setColumns,
  moveColumn,
} from '../actions/columnAction';
import {
  fetchTasks,
  createTask,
  deleteTask,
  editTask,
  moveTask,
} from '../actions/cardAction';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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

    if (type === 'COLUMN') {
      if (source.index !== destination.index) {
        dispatch(moveColumn(id, source.index, destination.index));
      }
      return;
    }

    if (type === 'TASK') {
      const sourceCol = source.droppableId.replace('column-', '');
      const destCol = destination.droppableId.replace('column-', '');

      if (sourceCol === destCol && source.index === destination.index) return;

      dispatch(
        moveTask(
          id,
          draggableId,
          sourceCol,
          destCol,
          source.index,
          destination.index
        )
      );
    }
  };

  const columns = columnsByBoard[id] || [];

  const reorderLocalColumns = (boardId, sourceIndex, destIndex) => {
    const newOrder = Array.from(columns);
    const [moved] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(destIndex, 0, moved);
    dispatch(setColumns(boardId, newOrder));
  };

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
                    //console.log('Rendering Draggable:', draggableId);

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
