import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import * as boardService from '../services/boardService';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './Home.module.css';

const Home = () => {
  const [boards, setBoards] = useState([]);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const fetchBoards = async () => {
    const boards = await boardService.getBoards();
    console.log('Ответ от сервера:', boards);
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

  if (user) {
    console.log('user:', user);
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Sidebar
          boards={boards}
          setBoards={setBoards}
          onCreateBoard={onCreateBoard}
          onDeleteBoard={onDeleteBoard}
        />
        <div className={styles.content}>
          <h3>Select a board to display its contents.</h3>
        </div>
      </div>
    </>
  );
};

export default Home;
