import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../style/BoardPage.module.css';

import { useBoard } from '../context/BoardContext.jsx';
import authService from '../services/authService';
import cardService from '../services/cardService';

import Header from './Header';
import Sidebar from './Sidebar';
import Column from './Column';

const BoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const {
    boards,
    columnsByBoard,
    fetchBoards,
    fetchColumns,
    onCreateBoard,
    onDeleteBoard,
    onCreateColumn,
    onDeleteColumn,
    onEditColumn,
  } = useBoard();

  const [tasksByBoard, setTasksByBoard] = useState({});
  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (id) fetchColumns(id);
  }, [id]);

  useEffect(() => {
    if (columnsByBoard[id]?.length > 0) {
      fetchTasks();
    }
  }, [columnsByBoard[id]]);

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

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return;
    await onCreateColumn(id, newColumnTitle);
    setNewColumnTitle('');
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

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Sidebar
          boards={boards}
          setBoards={() => {}}
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
                onEditColumn={(columnId, newTitle) => onEditColumn(columnId, newTitle, id)}
                onDeleteColumn={(colId) => onDeleteColumn(id, colId)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardPage;
