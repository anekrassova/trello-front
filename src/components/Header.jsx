import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import styles from '../style/Header.module.css';
import { useTheme } from '../ThemeContext';

const Header = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>{user?.email}</div>
      <div className={styles.actions}>
        <button onClick={toggleTheme}>Change Theme</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default React.memo(Header);
