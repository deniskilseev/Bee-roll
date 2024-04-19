import React from 'react';
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
import ForumList from './ForumList';
import ReccommendationPage from './ReccommendationPage';
import WarnedUsersPage from './WarnedUsersPage';
import { useUser } from './UserContext';

const App = () => {
  const { user } = useUser();

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
          <Route path="/forums/:forumName" element={<ForumPage />}/>
          <Route path="/followers/:username" element={<FollowersPage />} />
          <Route path="/following/:username" element={<FollowingPage />} />
          <Route path="/movies/:movieId" element={<MoviePage />} />
          <Route path="/movies" element={<ReccommendationPage />} />
          <Route path="/forums/:forumName/createpost" element={<CreatePostPage />} />
          <Route path="/forums/:forumName/createpost/:postId" element={<CreatePostPage />} />
          <Route path="/forums/:forumName/settings" element={<ForumSettingsPage />} />
          <Route path="/forumlist" element={<ForumList />}/>
          <Route path="/warnedusers" element={<WarnedUsersPage />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
