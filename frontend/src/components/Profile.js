// Profile.js
import React from 'react';
import PostList from './PostList';

const Profile = ({ user }) => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.profilePicture} alt="User Avatar" className="avatar" />
        <h2 className="username">{user.username}</h2>
        <p className="bio">{user.bio || 'No bio available'}</p>
      </div>
      <div className="profile-content">
        <div className="centered-section">
          <h3 className='bio-follow-header'>Followers</h3>
          <p className='bio-follows'>{user.followers.length}</p>
        </div>
        <div className="centered-section">
          <h3 className='bio-follow-header'>Following</h3>
          <p className='bio-follows'>{user.following.length}</p>
        </div>
      </div>
      <div className="posts">
        <div className="section">
          <h3 className="font-weight-bold">Posts</h3>
          <PostList posts={user.posts} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
