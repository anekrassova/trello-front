import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './BoardPage.module.css';
import authService from '../services/authService.js';
import * as boardService from '../services/boardService.js';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

const BoardPage = () => {
  const [boards, setBoards] = useState([]);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const fetchBoards = async () => {
    const boards = await boardService.getBoards();
    const formattedBoards = boards.data.map((board) => ({
      ...board,
      id: board.id,
    }));
    setBoards(formattedBoards);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const onCreateBoard = async (title) => {
    try {
      const newBoard = await boardService.createBoard(title);
      setBoards([...boards, newBoard]);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const onDeleteBoard = async (id) => {
    try {
      await boardService.deleteBoard(id);
      setBoards(boards.filter((board) => board.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении доски:', error);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Sidebar
          boards={boards}
          setBoards={setBoards}
          onDeleteBoard={onDeleteBoard}
          onCreateBoard={onCreateBoard}
        />
        <div className={styles.content}>
          <h3>Колонки.</h3>
        </div>
      </div>
    </>
  );
};

export default BoardPage;
