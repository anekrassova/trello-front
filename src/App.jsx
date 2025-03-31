import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
};

export default App;
