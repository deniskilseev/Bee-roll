import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import profileIcon from './assets/blank profile pic.jpg';
import axios from 'axios';


const OtherUserProfile = ( {currentUser} ) => {
  const { username } = useParams(); // Extract uid parameter from URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Fetch user profile data using username
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/getUserByUsername/${username}`);
        setUser(response.data.user_info);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    const fetchPostData = async () => {
      if (user && user.postsIds) { // Check if user and user.postsIds are not null
        try {
          const postsData = await Promise.all(
            user.postsIds.map(async (postId) => {
              const response = await axios.get(`http://localhost:3000/posts/getPost/${postId}`);
              return response.data.post_info; // Extract post_info object from response data
            })
          );
          
          setPosts(postsData);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };
    
    fetchPostData();
  }, [user]);

  const handleFollow = async () => {
    console.log('Current User:', currentUser);
    console.log('User followed/unfollowed:', user);

    try {
      const endpoint = isFollowing ? '/users/unfollowUser' : '/users/followUser';
      await axios.post(`http://localhost:3000${endpoint}`, {
        user_follower: currentUser.username,
        user_followed: user.login
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header text-center">
              <img src={user.profilePicture || profileIcon} alt="User Avatar" className="avatar img-fluid" />
              <h2 className="username mt-3">{user.login}</h2>
              <p className="bio text-center">{user.bio || 'No bio available'}</p>
              <div className="text-center mt-3">
                <button className="btn btn-primary" onClick={handleFollow}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 text-center">
                  <Link to={{ pathname: `/followers/${user.login}` }} style={{ cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}>
                    <div className='bio-follow-header'>
                      <h3 style={{ fontSize: 'inherit' }}>Followers</h3>
                      <p className='bio-follows'>{user.followersIds.length}</p>
                    </div>
                  </Link>
                </div>
                <div className="col-md-6 text-center">
                  <Link to={{ pathname: `/following/${user.login}` }} style={{ cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}>
                    <div className='bio-follow-header'>
                      <h3 style={{ fontSize: 'inherit' }}>Following</h3>
                      <p className='bio-follows'>{user.followsIds.length || 0}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <h3 className="font-weight-bold">Posts</h3>
              {posts.map((post) => (
                <div key={post.postId} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{post.postTitle}</h5>
                    <p className="card-text">{post.postText}</p>
                    <p className="card-text">Posted By: {user.login}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
