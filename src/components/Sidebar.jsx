import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Board from './Board';
import styles from '../style/Sidebar.module.css';

const Sidebar = ({ boards, setBoards, onCreateBoard, onDeleteBoard }) => {
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const navigate = useNavigate();

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

    const newBoard = await onCreateBoard(newBoardTitle);
    if (newBoard) {
      setBoards((prev) => [...prev, newBoard]);
    }
    setNewBoardTitle('');
  };

  const handleUpdateBoard = (updatedBoard) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === updatedBoard.id ? updatedBoard : board
      )
    );
  };

  return (
    <div className={styles.sidebar}>
      <h2>Trello Board</h2>
      <div className={styles.newBoardForm}>
        <input
          type="text"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder="Board name..."
        />
        <button onClick={handleCreateBoard}>+</button>
      </div>
      <div className={styles.boardList}>
        {boards.map((board) => (
          <div
            key={board.id}
            className={styles.boardLink}
          >
            <Board
              board={board}
              onDelete={onDeleteBoard}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
