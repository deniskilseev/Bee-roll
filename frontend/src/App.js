import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './Homepage';
import Taskbar from './components/Taskbar';
import ProfilePage from './Profile';
import WatchlistPage from './WatchlistPage';
import CreateForumPage from './CreateForum';
import ForumPage from './ForumPage';
import FollowersPage from './FollowersPage';
import FollowingPage from './FollowingPage';
import CreatePostPage from './CreatePost';
import OtherUserProfile from './OtherUserProfile';
import ForumSettingsPage from './ForumSettings';
import MoviePage from './MoviePage';
import { useUser } from './UserContext';

const App = () => {
  const { user } = useUser();


  const dummyUser = user.userData
  ? {
      id: user.userData.data_by_username.uid,
      username: user.userData.data_by_username.login,
      bio: 'Example bio',
      email: user.userData.data_by_username.email,
      profilePicture: 'blank profile pic.jpg',
      followers: user.userData.data_by_username.followersIds,
      following: user.userData.data_by_username.followsIds,
      posts: user.userData.data_by_username.postsIds,
      watchlists: user.userData.data_by_username.watchListsIds,
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
    watchlists: []
  };

  return (
    <Router>
      <div className="app">
        <Taskbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user/profile/:username" element={<OtherUserProfile />} />
          <Route path="/createforum" element={<CreateForumPage />}/>
          <Route path="/watchlists" element={<WatchlistPage />} />
          <Route path="/forums/:forumName" element={<ForumPage currentUser={dummyUser} />}/>
          <Route path="/followers/:username" element={<FollowersPage />} />
          <Route path="/following/:username" element={<FollowingPage />} />
          <Route path="/movies/:movieId" element={<MoviePage />} />
          <Route path="/forums/:forumName/createpost" element={<CreatePostPage />} />
          <Route path="/forums/:forumName/settings" element={<ForumSettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;