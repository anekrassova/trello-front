import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from '../style/Board.module.css';
import * as boardService from '../services/boardService';
import { removeBoard } from '../actions/boardAction.js';
import { updateBoard } from '../actions/boardAction.js';

const Board = ({ board, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);
  const dispatch = useDispatch();

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e) => setNewTitle(e.target.value);

  const handleSave = async () => {
    const response = await boardService.updateBoard(board.id, newTitle);
    const updatedBoard = response.data;
    if (updatedBoard) {
      dispatch(updateBoard(updatedBoard.id, updatedBoard.title));
      setIsEditing(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await boardService.deleteBoard(board.id);
    dispatch(removeBoard(board.id));
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
          <button onClick={handleSave} className={styles.saveButton}>✔</button>
        </div>
      ) : (
        <>
          <Link to={`/board/${board.id}`} className={styles.boardLink}>
            <span>{board.title}</span>
          </Link>
          <div className={styles.boardActions}>
            <button onClick={handleEdit} className={styles.boardButton}>✏</button>
            <button onClick={handleDelete} className={styles.boardButton}>✖</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Board;
