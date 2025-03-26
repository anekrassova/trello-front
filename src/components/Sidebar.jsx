import React, { useState } from 'react';
import Board from './Board';
import styles from './Sidebar.module.css';

const Sidebar = ({ boards, setBoards, onCreateBoard, onDeleteBoard }) => {
  const [newBoardTitle, setNewBoardTitle] = useState('');

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
      <div className={styles.newBoardForm}>
        <input
          type="text"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder="Board name..."
        />
        <button onClick={handleCreateBoard}>Create</button>
      </div>
      <div className={styles.boardList}>
        {boards.map((board) => (
          <Board
            key={board.id}
            board={board}
            onDelete={onDeleteBoard}
            onUpdate={handleUpdateBoard}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
