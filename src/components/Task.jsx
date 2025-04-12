import React, { useState, useCallback } from 'react';
import styles from '../style/Task.module.css';

const Task = ({ task, columnId, onEditTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.title);

  const handleSave = useCallback(() => {
    onEditTask(task.id, text);
    setIsEditing(false);
  }, [onEditTask, task.id, text]);

  const handleDelete = useCallback(() => {
    onDeleteTask(task.id, columnId);
  }, [onDeleteTask, task.id, columnId]);

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

export default React.memo(Task);
