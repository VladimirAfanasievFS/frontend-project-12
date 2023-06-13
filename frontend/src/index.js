import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const runApp = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  const app = await App();
  root.render(<React.StrictMode>{app}</React.StrictMode>);
};

runApp();
