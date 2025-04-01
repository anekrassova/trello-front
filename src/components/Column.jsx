import React, { useState, useCallback } from 'react';
import Task from './Task';
import styles from './Column.module.css';

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

  const handleAddTask = useCallback(() => {
    if (!newTaskText.trim()) return;
    onAddTask(column.id, newTaskText);
    setNewTaskText('');
  }, [onAddTask, column.id, newTaskText]);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e) => setNewTitle(e.target.value);

  const handleSave = useCallback(() => {
    onEditColumn(column.id, newTitle);
    setIsEditing(false);
  }, [onEditColumn, column.id, newTitle]);

  const handleDelete = useCallback(() => {
    onDeleteColumn(column.id);
  }, [onDeleteColumn, column.id]);

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
          <button onClick={handleSave} className={styles.saveButton}>✔</button>
        </div>
      ) : (
        <div className={styles.columnHeader}>
          <h4>{column.title}</h4>
          <div className={styles.columnActions}>
            <button onClick={handleEdit} className={styles.columnButton}>✏</button>
            <button onClick={handleDelete} className={styles.columnButton}>✖</button>
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

export default React.memo(Column);
