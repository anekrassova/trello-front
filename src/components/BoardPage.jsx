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

const BoardPage = () => {
  const { id } = useParams();
  //console.log('id board:', typeof id)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = authService.getCurrentUser();
  const boards = useSelector((state) => state.boards);
  const columnsByBoard = useSelector((state) => state.columnsByBoard);
  const tasksByBoard = useSelector((state) => state.tasksByBoard);

  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (id) {
      dispatch(fetchBoards());
      dispatch(fetchColumns(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (columnsByBoard[id]) {
      console.log('board id')
      dispatch(fetchTasks(id, columnsByBoard[id]));
    }
  }, [dispatch, id, columnsByBoard]);

  const onCreateBoard = async (title) => {
    dispatch(createBoard(title));
  };

  const onDeleteBoard = async (id) => {
    dispatch(removeBoard(id));
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    dispatch(createColumn(id, newColumnTitle));
    setNewColumnTitle('');
  };

  const handleAddTask = (columnId, title) => {
    dispatch(createTask(id, columnId, { title }));
  };

  const handleDeleteTask = (columnId, taskId) => {
    dispatch(deleteTask(id, columnId, taskId));
  };

  const handleEditTask = (columnId, taskId, updates) => {
    dispatch(editTask(id, columnId, taskId, { updates }));
  };

  const handleDeleteColumn = (columnId) => {
    dispatch(deleteColumn(id, columnId));
  };

  const handleEditColumn = (columnId, newTitle) => {
    dispatch(editColumn(id, columnId, newTitle));
  };

  if (!columnsByBoard[id]) {
    return <div>Loading board...</div>;
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Sidebar
          boards={boards}
          setBoards={setBoards}
          onCreateBoard={onCreateBoard}
          onDeleteBoard={onDeleteBoard}
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
          <div className={styles.columns}>
            {columnsByBoard[id]?.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={tasksByBoard[id]?.[column.id] || []}
                onAddTask={(title) => handleAddTask(column.id, title)}
                onEditTask={(taskId, updates) => handleEditTask(column.id, taskId, updates)}
                onDeleteTask={(taskId) => handleDeleteTask(column.id, taskId)}
                onEditColumn={(newTitle) => handleEditColumn(column.id, newTitle)}
                onDeleteColumn={() => handleDeleteColumn(column.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardPage;
