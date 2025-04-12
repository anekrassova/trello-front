import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { Provider } from 'react-redux';
import store from './store.js';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <div className="app-container">
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
