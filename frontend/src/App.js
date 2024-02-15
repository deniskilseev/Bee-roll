// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/Homepage';
import Taskbar from './components/Taskbar';
import ProfilePage from './components/Profile';
import User from './components/User';

const App = () => {
  const dummyUser = {
    id: 1,
    username: 'johndoe',
    bio: 'Example bio',
    email: 'john.doe@example.com',
    profilePicture: 'blank profile pic.jpg',
    followers: [1, 2, 3, 4],
    following: [1, 2, 3],
    posts: [
      { id: 1, title: 'First Post', content: 'First post.' },
      { id: 2, title: 'Second Post', content: 'Second post.' },
    ],
  };

  return (
    <Router>
      <div className="app">
        <Taskbar />
        <User user={dummyUser} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage user={dummyUser} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
