import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Task from './Task';
import styles from '../style/Column.module.css';
import * as columnService from '../services/columnService';
import { editColumn, deleteColumn } from '../actions/columnAction';
import { createTask } from '../actions/cardAction';
import { Droppable, Draggable } from '@hello-pangea/dnd';

const Column = ({ column, tasks, boardId }) => {
  const dispatch = useDispatch();
  const [newTaskText, setNewTaskText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  const droppableId = `column-${column.id}`;

  //console.log('Rendering Column with droppableId:', droppableId);

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    dispatch(createTask(boardId, column.id, { title: newTaskText }));
    setNewTaskText('');
  };

  const handleSave = async () => {
    await columnService.updateColumn(column.id, newTitle);
    dispatch(editColumn(boardId, column.id, newTitle));
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteColumn(boardId, column.id));
  };

  return (
    <div className={styles.column}>
      {isEditing ? (
        <div className={styles.editContainer}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
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
            <button
              onClick={() => setIsEditing(true)}
              className={styles.columnButton}
            >
              ✏
            </button>
            <button onClick={handleDelete} className={styles.columnButton}>
              ✖
            </button>
          </div>
        </div>
      )}

      <Droppable droppableId={droppableId} type="TASK">
        {(provided) => (
          <div
            className={styles.taskList}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={`task-${task.id}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task task={task} columnId={column.id} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

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
