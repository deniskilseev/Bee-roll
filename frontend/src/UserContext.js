import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userData: null,
    token: null
  });

  useEffect(() => {
    const storedToken = Cookies.get('beerollToken');
    if (storedToken) {
      setUser(prevUser => ({ ...prevUser, token: storedToken }));
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
    localStorage.removeItem('beerollToken'); // Remove token from localStorage on logout
    setUser({ userData: null, token: null });
  };

  return (
    <UserContext.Provider value={{ user, updateUser, updateWatchlists, logout }}>
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
