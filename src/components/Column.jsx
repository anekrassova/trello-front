import React, { useState } from 'react';
import Task from './Task';
import styles from './Column.module.css';
import * as columnService from '../services/columnService';

const Column = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditColumn,
  onDeleteColumn,
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;
    try {
      await onAddTask(column.id, newTaskText);
      setNewTaskText(''); // Очищаем поле после добавления
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleSave = async () => {
    const updatedColumn = await columnService.updateColumn(column.id, newTitle);
    console.log('Ответ от сервера:', updatedColumn);
    if (updatedColumn) {
      onEditColumn(column.id, newTitle); // Обновляем в родителе
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    await columnService.deleteColumn(column.id);
    onDeleteColumn(column.id); // Удаляем в родителе
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
          <Task
            key={task.id}
            task={task}
            columnId={column.id}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
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
