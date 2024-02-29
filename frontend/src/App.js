import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './Homepage';
import Taskbar from './components/Taskbar';
import ProfilePage from './Profile';
import WatchlistPage from './WatchlistPage';
import User from './components/User';
import { UserProvider, useUser } from './UserContext';

const App = () => {
  const { user } = useUser();

  const dummyUser = user
  ? {
      id: user.data_by_username.uid,
      username: user.data_by_username.login,
      bio: 'Example bio',
      email: user.data_by_username.email,
      profilePicture: 'blank profile pic.jpg',
      followers: [],
      following: [],
      posts: [
        { id: 1, title: 'First Post', content: 'First post.', author: user.data_by_username },
        { id: 2, title: 'Second Post', content: 'Second post.', author: user.data_by_username },
      ],
    }
  : 
  {
    id: 1,
    username: 'john_doe',
    bio: 'Example bio',
    email: 'john.doe@example.com',
    profilePicture: 'blank profile pic.jpg',
    followers: [1, 2, 3, 4],
    following: [1, 2, 3],
  };

  dummyUser.posts = [
    { id: 1, title: 'First Post', content: 'First post.', author: dummyUser},
    { id: 2, title: 'Second Post', content: 'Second post.', author: dummyUser},
  ];

  return (
    <Router>
      <div className="app">
        <Taskbar />
        <Routes>
          <Route path="/" element={<HomePage user={dummyUser} />} />
          <Route path="/profile" element={<ProfilePage user={dummyUser} />} />
          <Route path="/watchlists" element={<WatchlistPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
