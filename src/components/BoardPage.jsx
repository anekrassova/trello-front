import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './BoardPage.module.css';
import authService from '../services/authService.js';
import * as boardService from '../services/boardService.js';
import columnService from '../services/columnService.js';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Column from './Column.jsx';
import cardService from '../services/cardService.js';

const BoardPage = () => {
  const [boards, setBoards] = useState([]);
  const [columnsByBoard, setColumnsByBoard] = useState({});
  const [tasksByBoard, setTasksByBoard] = useState({});
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const { id } = useParams();
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
    fetchColumns();
  }, [id]);

  useEffect(() => {
    if (columnsByBoard[id]?.length > 0) {
      fetchTasks();
    }
  }, [columnsByBoard[id]]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const fetchBoards = async () => {
    try {
      const boards = await boardService.getBoards();
      setBoards(boards.data);
    } catch (error) {
      console.error('Ошибка загрузки досок:', error);
    }
  };

  const fetchColumns = async () => {
    if (!id) return;
    try {
      const response = await columnService.getColumns(id);
      const columns = response.data;
      setColumnsByBoard((prev) => ({
        ...prev,
        [id]: columns || [],
      }));
    } catch (error) {
      console.error('Ошибка загрузки колонок:', error);
    }
  };

  const fetchTasks = async () => {
    if (!id || !columnsByBoard[id]) return;

    try {
      const tasksArray = await Promise.all(
        columnsByBoard[id].map(async (column) => {
          const response = await cardService.getCards(column.id);
          return { [column.id]: response.data || [] };
        })
      );

      const tasks = Object.assign({}, ...tasksArray);

      setTasksByBoard((prev) => ({
        ...prev,
        [id]: tasks,
      }));
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  };

  const onCreateBoard = async (title) => {
    try {
      const response = await boardService.createBoard(title);
      const newBoard = response.data;
      setBoards([...boards, newBoard]);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const onDeleteBoard = async (id) => {
    try {
      await boardService.deleteBoard(id);
      setBoards(boards.filter((board) => board.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении доски:', error);
    }
  };

  const handleAddTask = async (columnId, title) => {
    try {
      const response = await cardService.createCard(title, columnId);
      const newTask = response.data;
      setTasksByBoard((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || {}),
          [columnId]: [...(prev[id]?.[columnId] || []), newTask],
        },
      }));
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error);
    }
  };

  const handleEditTask = async (taskId, newText) => {
    try {
      const updatedTask = await cardService.updateCard(taskId, {
        title: newText,
      });

      setTasksByBoard((prev) => ({
        ...prev,
        [id]: Object.fromEntries(
          Object.entries(prev[id] || {}).map(([colId, tasks]) => [
            colId,
            tasks.map((task) =>
              task.id === taskId
                ? { ...task, title: updatedTask.data.title }
                : task
            ),
          ])
        ),
      }));
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await cardService.deleteCard(taskId);

      setTasksByBoard((prev) => ({
        ...prev,
        [id]: Object.fromEntries(
          Object.entries(prev[id] || {}).map(([colId, tasks]) => [
            colId,
            tasks.filter((task) => task.id !== taskId),
          ])
        ),
      }));
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return;
    try {
      const response = await columnService.createColumn(id, newColumnTitle);
      const newColumn = response.data;
      setColumnsByBoard((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), newColumn],
      }));
      setNewColumnTitle('');
    } catch (error) {
      console.error('Ошибка при создании колонки:', error);
    }
  };

  const handleEditColumn = async (columnId, newTitle) => {
    try {
      const updatedColumn = await columnService.updateColumn(
        columnId,
        newTitle
      );

      setColumnsByBoard((prev) => ({
        ...prev,
        [id]: (prev[id] || []).map((col) =>
          col.id === columnId
            ? { ...col, title: updatedColumn.data.title }
            : col
        ),
      }));
    } catch (error) {
      console.error('Ошибка при обновлении колонки:', error);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await columnService.deleteColumn(columnId);

      setColumnsByBoard((prev) => ({
        ...prev,
        [id]: (prev[id] || []).filter((col) => col.id !== columnId),
      }));

      setTasksByBoard((prev) => {
        const updatedTasks = { ...prev };
        delete updatedTasks[columnId];
        return updatedTasks;
      });
    } catch (error) {
      console.error('Ошибка при удалении колонки:', error);
    }
  };

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
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onEditColumn={handleEditColumn}
                onDeleteColumn={handleDeleteColumn}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardPage;
