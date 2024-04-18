// WarnedUsersPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WarnedUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchWarnedUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/getWarnedUsers');
        setUsers(response.data); // Assuming the response is an array of user objects
      } catch (error) {
        console.error('Error fetching warned users:', error);
      }
    };

    fetchWarnedUsers();
  }, []);

  return (
    <div>
      <h2>Warned Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.uid}>
            {user.username} - Warning Level: {user.warnings}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WarnedUsersPage;
