import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../services/authService';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from '../style/Home.module.css';
import { setBoards, removeBoard, updateBoardInState,fetchBoards, createBoard, deleteBoard, updateBoard } from '../actions/boardAction';
import * as boardService from '../services/boardService.js';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const boards = useSelector((state) => state.boards);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  // useEffect(() => {
  //   if (user && boards.length > 0) {
  //     navigate(`/board/${boards[0].id}`);
  //   }
  // }, [boards, user, navigate]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const onCreateBoard = async (title) => {
    dispatch(createBoard(title));
  };

  const onDeleteBoard = async (id) => {
    dispatch(removeBoard(id));
  };

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
          <h3>Choose board to see its content.</h3>
        </div>
      </div>
    </>
  );
};

export default Home;
