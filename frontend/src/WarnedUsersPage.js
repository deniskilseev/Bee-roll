// WarnedUsersPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/WarnedUsersPage.css'; 


const WarnedUsersPage = () => {
  const [warnedUsers, setWarnedUsers] = useState([]);

  useEffect(() => {
    fetchWarnedUsers();
  }, []);

  const fetchWarnedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/getWarnedUsers');
      setWarnedUsers(response.data.warnedUsers);
    } catch (error) {
      console.error('Error fetching warned users:', error);
    }
  };

  return (
    <div className="warned-users-container">
      <h1 className="warned-users-title">Warned Users</h1>
      <table className="warned-users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Warning Level</th>
          </tr>
        </thead>
        <tbody>
          {warnedUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.login}</td>
              <td>{user.warnings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarnedUsersPage;
