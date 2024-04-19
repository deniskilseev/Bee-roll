import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import profileIcon from './assets/blank profile pic.jpg';
import axios from 'axios';
import OtherUserWatchlist from './components/OtherUserWatchlist';
import { useUser } from './UserContext';
import { useIsRTL } from 'react-bootstrap/esm/ThemeProvider';


const OtherUserProfile = () => {
  const { username } = useParams(); // Extract uid parameter from URL
  const [otherUser, setOtherUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [watchlists, setWatchlists] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [warningDescription, setWarningDescription] = useState('');
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('posts');
  const [showSpoilersMap, setShowSpoilersMap] = useState({});
  const token = user.token;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const fetchWatchlist = useCallback(async (watchListId) => {
    try {
      if (watchlists.some((watchlist) => watchlist.watchListId === watchListId)) {
        return;
      }

      const response = await axios.get(`http://localhost:3000/watchlists/getWatchlist/${watchListId}`, {
        headers: {
          'Authorization': `Bee-roll ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        const watchlistData = await response.data.watchlist_data;
        setWatchlists((prevWatchlists) => {
          if (!prevWatchlists.some((watchlist) => watchlist.watchListId === watchListId)) {
            return [...prevWatchlists, watchlistData];
          } else {
            return prevWatchlists;
          }
        });
        return watchlistData;
      } else {
        console.error(`Failed to fetch watchlist: ${watchListId}`);
      }
    } catch (error) {
      console.error(`Error fetching watchlist: ${watchListId}`, error);
    }
  }, [watchlists, token]);

  useEffect(() => {
    const fetchInitialWatchlists = async () => {
      for (const watchListId of otherUser.watchListsIds) {
        try {
          const watchlistData = await fetchWatchlist(watchListId);
          if (watchlistData && watchlistData.isPublic) {
            // Only add the watchlist to the array if it's public
            setWatchlists((prevWatchlists) => {
              if (!prevWatchlists.some((watchlist) => watchlist.watchListId === watchListId)) {
                return [...prevWatchlists, watchlistData];
              } else {
                return prevWatchlists;
              }
            });
          }
        } catch (error) {
          console.error(`Error fetching watchlist: ${watchListId}`, error);
        }
      }
    };

    if (otherUser) {
      fetchInitialWatchlists();
    }
  }, [otherUser, fetchWatchlist]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/getUserByUsername/${username}`);
        setOtherUser(response.data.user_info);
        console.log("user info: ", user.userData.data_by_username.isAdmin);
        setIsAdmin(user.userData.data_by_username.isAdmin);
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

  const handleWarnUser = async () => {
    console.log("here");
    try {
      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };

      console.log("here 2");
      console.log("other user id: ", otherUser.uid);

      const description = prompt('Enter warning description:');
      if (!description) return;

      await axios.post(`http://localhost:3000/users/warn/${otherUser.uid}`, { warningDescription: description }, { headers });
      
      console.log("here 3");
      const updatedUser = { ...otherUser, warningCount: otherUser.warningCount + 1 };
      setOtherUser(updatedUser);

    } catch (error) {
      console.error('Error warning user:', error);
    }
  };

  const handleShowSpoilers = (postId) => {
    setShowSpoilersMap(prevState => ({
      ...prevState,
      [postId]: true
    }));
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
              {console.log("isAdmin: ", isAdmin)}
              {isAdmin && (
                  <button className="btn btn-warning mr-2" onClick={handleWarnUser}>
                    Warn
                  </button>
                )}
                {otherUser.warnings > 0 && (
                  <div className="warning-level">
                    <p>Warning Level: {otherUser.warnings} ({otherUser.warningDescription})</p>
                  </div>
                )}
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
            </div><div className="card-footer">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => handleTabChange('posts')}>Posts</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'watchlists' ? 'active' : ''}`} onClick={() => handleTabChange('watchlists')}>Watchlists</button>
                </li>
              </ul>
              <div className="tab-content">
                {activeTab === 'posts' && (
                  <div className="tab-pane active" id="posts">
                    {posts.map((post) => (
                      <div key={post.postId} className="card mb-3">
                        <div className="card-body">
                          <h5 className="card-title">{post.postTitle}</h5>
                          {showSpoilersMap[post.postId] || !post.containsSpoilers ? (
                            <p className="card-text">{post.postText}</p>
                          ) : (
                            <button className="btn btn-primary mb-2" onClick={() => handleShowSpoilers(post.postId)}>Show spoilers</button>
                          )}
                          <p className="card-text">Posted By: {otherUser.login}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'watchlists' && (
                  <div className="tab-pane active" id="watchlists">
                    {watchlists.length > 0 ? (
                      watchlists.map((watchlist) => (
                        <OtherUserWatchlist key={watchlist.watchListId} watchlist={watchlist} />
                      ))
                    ) : (
                      <p>No watchlists found.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
