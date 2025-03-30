import React, { useState } from 'react';
import styles from './Task.module.css';

const Task = ({ task, onEditTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const handleSave = () => {
    onEditTask(task.id, text);
    setIsEditing(false);
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
          <span>{task.text}</span>
          <div className={styles.actions}>
            <button onClick={() => setIsEditing(true)}>✏</button>
            <button onClick={() => onDeleteTask(task.id)}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;