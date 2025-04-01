import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './ThemeContext.jsx';
import { BoardProvider } from './context/BoardContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <BoardProvider>
          <div className="app-container">
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </BoardProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};


export default App;
