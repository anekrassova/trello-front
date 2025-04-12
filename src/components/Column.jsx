import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Task from './Task';
import styles from '../style/Column.module.css';
import * as columnService from '../services/columnService';
import * as cardService from '../services/cardService';
import {
  editColumn,
  deleteColumn,
} from '../actions/columnAction';
import {
  createTask,
} from '../actions/cardAction';

const Column = ({ column, tasks, onDeleteColumn }) => {
  const dispatch = useDispatch();
  const [newTaskText, setNewTaskText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  const boardId = useSelector((state) =>
    Object.keys(state.columnsByBoard).find((boardId) =>
      state.columnsByBoard[boardId].some((col) => col.id === column.id)
    )
  );

  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;
    try {
      dispatch(createTask(boardId, column.id, { title: newTaskText }));
      setNewTaskText('');
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleChange = (e) => setNewTitle(e.target.value);

  const handleSave = async () => {
    try {
      await columnService.updateColumn(column.id, newTitle);
      dispatch(editColumn(boardId, column.id, newTitle));
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при обновлении колонки:', error);
    }
  };

  const handleDelete = async () => {
    try {
      onDeleteColumn(column.id);
    } catch (error) {
      console.error('Ошибка при удалении колонки:', error);
    }
  };

  return (
    <div className={styles.column}>
      {isEditing ? (
        <div className={styles.editContainer}>
          <input
            type="text"
            value={newTitle}
            onChange={handleChange}
            className={styles.columnInput}
          />
          <button onClick={handleSave} className={styles.saveButton}>
            ✔
          </button>
        </div>
      ) : (
        <div className={styles.columnHeader}>
          <h4>{column.title}</h4>
          <div className={styles.columnActions}>
            <button onClick={handleEdit} className={styles.columnButton}>
              ✏
            </button>
            <button onClick={handleDelete} className={styles.columnButton}>
              ✖
            </button>
          </div>
        </div>
      )}

      <div className={styles.taskList}>
        {tasks.map((task) => (
          <Task key={task.id} task={task} columnId={column.id} />
        ))}
      </div>

      <div className={styles.addTaskForm}>
        <input
          type="text"
          placeholder="Add new"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button onClick={handleAddTask}>+</button>
      </div>
    </div>
  );
};

export default Column;
