import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './BoardPage.module.css';
import authService from '../services/authService.js';
import * as boardService from '../services/boardService.js';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Column from './Column.jsx';

const BoardPage = () => {
  const [boards, setBoards] = useState([]);
  const [columnsByBoard, setColumnsByBoard] = useState({});
  const [tasksByBoard, setTasksByBoard] = useState({});
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const { id } = useParams();
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const fetchBoards = async () => {
    const boards = await boardService.getBoards();
    const formattedBoards = boards.data.map((board) => ({
      ...board,
      id: board.id,
    }));
    setBoards(formattedBoards);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (!columnsByBoard[id]) {
      setColumnsByBoard((prev) => ({
        ...prev,
        [id]: [],
      }));
    }
    if (!tasksByBoard[id]) {
      setTasksByBoard((prev) => ({
        ...prev,
        [id]: [],
      }));
    }
  }, [id]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const onCreateBoard = async (title) => {
    try {
      const newBoard = await boardService.createBoard(title);
      setBoards([...boards, newBoard]);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const onDeleteBoard = async (boardId) => {
    try {
      await boardService.deleteBoard(boardId);
      setBoards(boards.filter((board) => board.id !== boardId));
      setColumnsByBoard((prev) => {
        const updated = { ...prev };
        delete updated[boardId];
        return updated;
      });
      setTasksByBoard((prev) => {
        const updated = { ...prev };
        delete updated[boardId];
        return updated;
      });
      navigate('/');
    } catch (error) {
      console.error('Ошибка при удалении доски:', error);
    }
  };

  const handleAddTask = (columnId, text) => {
    const newTask = {
      id: Date.now(),
      columnId,
      text,
    };
    setTasksByBoard((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newTask],
    }));
  };

  const handleEditTask = (taskId, newText) => {
    setTasksByBoard((prev) => ({
      ...prev,
      [id]: prev[id].map((task) =>
        task.id === taskId ? { ...task, text: newText } : task
      ),
    }));
  };

  const handleDeleteTask = (taskId) => {
    setTasksByBoard((prev) => ({
      ...prev,
      [id]: prev[id].filter((task) => task.id !== taskId),
    }));
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newColumn = {
      id: Date.now(),
      title: newColumnTitle,
    };
    setColumnsByBoard((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newColumn],
    }));
    setNewColumnTitle('');
  };

  const currentColumns = columnsByBoard[id] || [];
  const currentTasks = tasksByBoard[id] || [];

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Sidebar
          boards={boards}
          setBoards={setBoards}
          onDeleteBoard={onDeleteBoard}
          onCreateBoard={onCreateBoard}
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
            {currentColumns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={currentTasks.filter((task) => task.columnId === column.id)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardPage;
