import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import config from './config';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userData: null,
    token: null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get('beerollToken');
    if (storedToken) {
      // Check if the stored token is valid by sending a request to the server
      axios.get(`${config.apiBaseUrl}/users/getSelf`, {
        headers: {
          'Authorization': `Bee-roll ${storedToken}`,
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        // If the token is valid, update the user state with user data and token
        setUser({ userData: response.data, token: response.data.token });
        setLoading(false);
      })
      .catch(error => {
        // If the token is invalid, remove the token from cookies and reset user state
        Cookies.remove('beerollToken');
        alert('Your session has expired. Please log in again.');
        setUser({ userData: null, token: null });
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const updateUser = (userData, newToken) => {
    console.log("updateUser: Updating user with token:", newToken);
    setUser({ userData, token: newToken });
  };

  const updateWatchlists = (newWatchlist) => {
    setUser((prevUser) => {
      return {
        ...prevUser,
        watchlists: Array.isArray(prevUser?.watchlists)
          ? [...prevUser?.watchlists, newWatchlist]
          : [newWatchlist],
      };
    });
  };

  const logout = () => {
    localStorage.removeItem('beerollToken');
    setUser({ userData: null, token: null });
  };

  return (
    <UserContext.Provider value={{ user, updateUser, updateWatchlists, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
