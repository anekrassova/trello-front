import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>{user?.email}</div>
      <div className={styles.actions}>
        <button onClick={toggleTheme}>Change Theme</button>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
};

export default Header;
