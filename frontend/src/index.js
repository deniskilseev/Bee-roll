import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/styles.css';
import { UserProvider } from './UserContext'; // Import UserProvider
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById('root')
);
