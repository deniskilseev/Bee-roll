import { useState, useEffect } from 'react';

const User = ({ user }) => {
  const [userData, setUserData] = useState({
    id: null,
    username: '',
    bio: '',
    email: '',
    profilePicture: '',
    followers: [],
    following: [],
    posts: [],
  });

  useEffect(() => {
    setUserData(user);
  }, [user]);

  return null;
};

export default User;
