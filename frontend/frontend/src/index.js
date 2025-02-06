import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthPagesProvider } from './context/AuthPages'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthPagesProvider>


      <App />
    </AuthPagesProvider>
  </React.StrictMode>
);
