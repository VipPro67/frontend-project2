import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './App';
import './index.css';
import { Provider } from 'jotai';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <AppRouter />
    </Provider>
  </React.StrictMode>
);
