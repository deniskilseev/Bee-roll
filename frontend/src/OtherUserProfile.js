import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import profileIcon from './assets/blank profile pic.jpg';
import axios from 'axios';
import { useUser } from './UserContext';


const OtherUserProfile = () => {
  const { username } = useParams(); // Extract uid parameter from URL
  const [otherUser, setOtherUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useUser();
  const token = user.token;

  useEffect(() => {
    // Fetch user profile data using username
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/getUserByUsername/${username}`);
        setOtherUser(response.data.user_info);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    const fetchPostData = async () => {
      if (otherUser && otherUser.postsIds) {
        try {
          const postsData = await Promise.all(
            otherUser.postsIds.map(async (postId) => {
              const headers = {
                'Authorization': `Bee-roll ${token}`,
                'Content-Type': 'application/json'
              };
              const response = await axios.get(`http://localhost:3000/posts/getPost/${postId}`, { headers });
              return response.data.post_info;
            })
          );
          
          setPosts(postsData);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };
    
    fetchPostData();
  }, [otherUser, token]);

  const handleFollow = async () => {
    console.log('Current User:', user);
    console.log('User followed/unfollowed:', otherUser);

    try {
      const endpoint = isFollowing ? '/users/unfollowUser' : '/users/followUser';
      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };
      await axios.post(`http://localhost:3000${endpoint}`, {
        user_follower: user.username,
        user_followed: otherUser.login
      }, { headers });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  if (!otherUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header text-center">
              <img src={otherUser.profilePicture || profileIcon} alt="User Avatar" className="avatar img-fluid" />
              <h2 className="username mt-3">{otherUser.login}</h2>
              <p className="bio text-center">{otherUser.bio || 'No bio available'}</p>
              <div className="text-center mt-3">
                <button className="btn btn-primary" onClick={handleFollow}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 text-center">
                  <Link to={{ pathname: `/followers/${otherUser.login}` }} style={{ cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}>
                    <div className='bio-follow-header'>
                      <h3 style={{ fontSize: 'inherit' }}>Followers</h3>
                      <p className='bio-follows'>{otherUser.followersIds.length}</p>
                    </div>
                  </Link>
                </div>
                <div className="col-md-6 text-center">
                  <Link to={{ pathname: `/following/${otherUser.login}` }} style={{ cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}>
                    <div className='bio-follow-header'>
                      <h3 style={{ fontSize: 'inherit' }}>Following</h3>
                      <p className='bio-follows'>{otherUser.followsIds.length || 0}</p>
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
                    <p className="card-text">Posted By: {otherUser.login}</p>
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
