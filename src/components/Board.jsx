import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Board.module.css';
import * as boardService from '../services/boardService';

const Board = ({ board, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleSave = async () => {
    const updatedBoard = await boardService.updateBoard(board.id, newTitle);
    if (updatedBoard) {
      onUpdate(updatedBoard);
      setIsEditing(false);
      setNewTitle('');
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(board.id);
  };

  return (
    <div className={styles.boardItem}>
      {isEditing ? (
        <div className={styles.editContainer}>
          <input
            type="text"
            value={newTitle}
            onChange={handleChange}
            className={styles.boardInput}
          />
          <button onClick={handleSave} className={styles.saveButton}>
            ✔
          </button>
        </div>
      ) : (
        <>
          <Link to={`/${board.id}`} className={styles.boardLink}>
            <span>{board.title}</span>
          </Link>
          <div className={styles.boardActions}>
            <button onClick={handleEdit} className={styles.boardButton}>
              ✏
            </button>
            <button onClick={handleDelete} className={styles.boardButton}>
              ✖
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Board;
