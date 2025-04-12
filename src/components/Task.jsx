import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../style/Task.module.css';
import * as cardService from '../services/cardService';
import { editTask, deleteTask } from '../actions/cardAction';

const Task = ({ task, columnId }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.title);

  const boardId = useSelector((state) =>
    Object.keys(state.tasksByBoard).find((boardId) =>
      state.tasksByBoard[boardId]?.[columnId]?.some((t) => t.id === task.id)
    )
  );

  const handleSave = async () => {
    try {
      dispatch(editTask(boardId, columnId, task.id, { title: text }));
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteTask(boardId, columnId, task.id));
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };

  return (
    <div className={styles.task}>
      {isEditing ? (
        <div className={styles.editing}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleSave}>✔</button>
        </div>
      ) : (
        <div className={styles.view}>
          <span>{task.title}</span>
          <div className={styles.actions}>
            <button onClick={() => setIsEditing(true)}>✏</button>
            <button onClick={handleDelete}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
