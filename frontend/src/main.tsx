import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import axios from 'axios';
import { API_URL } from './config';

axios.defaults.baseURL = API_URL;


const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Failed to find the root element.");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
