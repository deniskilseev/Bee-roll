import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/styles.css';
import { UserProvider } from './UserContext'; // Import UserProvider

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById('root')
);
