import React, { createContext, useContext, useState } from 'react';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (userData) => {
    setUser((prevUser) => ({ ...prevUser, ...userData }));
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
    setUser(null);
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
