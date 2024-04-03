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
import { useUser } from './UserContext';

const App = () => {
  const { user } = useUser();
  const [forums, setForums] = useState([]);

  const dummyUser = user
  ? {
      id: user.data_by_username.uid,
      username: user.data_by_username.login,
      bio: 'Example bio',
      email: user.data_by_username.email,
      profilePicture: 'blank profile pic.jpg',
      followers: user.data_by_username.followersIds,
      following: user.data_by_username.followsIds,
      posts: user.data_by_username.postsIds,
      watchlists: user.data_by_username.watchListsIds,
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

  const addForum = (forum) => {
    setForums([...forums, forum]);
  };

  return (
    <Router>
      <div className="app">
        <Taskbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage user={dummyUser} />} />
          <Route path="/user/profile/:username" element={<OtherUserProfile currentUser={dummyUser} />} />
          <Route path="/createforum" element={<CreateForumPage onForumCreate={addForum} user={dummyUser} />}/>
          <Route path="/watchlists" element={<WatchlistPage user={dummyUser} />} />
          <Route path="/forums/:forumName" element={<ForumPage forums={forums} currentUser={dummyUser} />}/>
          <Route path="/followers/:username" element={<FollowersPage />} />
          <Route path="/following/:username" element={<FollowingPage />} />
          <Route path="/forums/:forumName/createpost" element={<CreatePostPage user={dummyUser} />} />
          <Route path="/forums/:forumName/settings" element={<ForumSettingsPage user={dummyUser} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;