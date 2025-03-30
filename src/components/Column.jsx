import React, { useState } from 'react';
import Task from './Task';
import styles from './Column.module.css';

const Column = ({ column, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(column.id, newTaskText);
      setNewTaskText('');
    }
  };

  return (
    <div className={styles.column}>
      <h4>{column.title}</h4>
      <div className={styles.taskList}>
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
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