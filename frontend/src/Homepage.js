import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import axios from 'axios';
import config from './config';

const HomePage = () => {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [postIds, setPostIds] = useState([]);
    const [forumPosts, setForumPosts] = useState([]);
    const [showHomepage, setShowHomepage] = useState(false);

    useEffect(() => {
      if (!user.userData) {
          setShowHomepage(true);
      } else {
          setShowHomepage(false);
          const sendPostRequest = async () => {
              const token = user.token;
              try {
                  const headers = {
                      'Authorization': `Bee-roll ${token}`,
                      'Content-Type': 'application/json'
                  };
                  const response = await axios.post(`${config.apiBaseUrl}/posts/getRecentPosts`, {
                      user_login: user.userData.data_by_username.login
                  }, { headers });
                  setPostIds(response.data);
              } catch (error) {
                  console.error('Failed to retrieve posts:', error.message);
              }
          };
          sendPostRequest();
      }
    }, [user]);


  useEffect(() => {
      const fetchUserPosts = async () => {
        if (user.userData && postIds.posts) {
          const token = user.token;
          try {
            const postsData = await Promise.all(
              postIds.posts.map(async (postId) => {
                const headers = {
                  'Authorization': `Bee-roll ${token}`,
                  'Content-Type': 'application/json'
                };
                const postResponse = await axios.get(`${config.apiBaseUrl}/posts/getPost/${postId}`, { headers });
                const postData = postResponse.data.post_info;

                const userResponse = await axios.get(`${config.apiBaseUrl}/users/getUser/${postData.userId}`);
                const userData = userResponse.data.user_info;
      
                return { ...postData, user: userData.login };
              })
            );
            
            setPosts(postsData);
          } catch (error) {
            console.error('Error fetching posts:', error);
          }
        }
    };

    const fetchForumPosts = async () => {
      if (user.userData) {
          const token = user.token;
          try {
            const headers = {
                'Authorization': `Bee-roll ${token}`,
                'Content-Type': 'application/json'
            };
            const forumsResponse = await axios.get(`${config.apiBaseUrl}/forums/`, { headers });
            const allForums = forumsResponse.data;

            const userForumIds = user.userData.data_by_username.forumIds;

            const followedForums = allForums.publicForums.filter(forum => userForumIds.includes(forum.forumId));

            const forumPostIds = followedForums.reduce((acc, forum) => {
              acc.push(...forum.postIds);
              return acc;
            }, []);

            const postsData = await Promise.all(
              forumPostIds.map(async (postId) => {
                const headers = {
                  'Authorization': `Bee-roll ${token}`,
                  'Content-Type': 'application/json'
                };
                const postResponse = await axios.get(`${config.apiBaseUrl}/posts/getPost/${postId}`, { headers });
                const postData = postResponse.data.post_info;

                const userResponse = await axios.get(`${config.apiBaseUrl}/users/getUser/${postData.userId}`);
                const userData = userResponse.data.user_info;
      
                return { ...postData, user: userData.login };
              }))
              
              setForumPosts(postsData);
          } catch (error) {
              console.error('Error fetching forum posts:', error);
          }
      }
    };
    if (activeTab === 'posts') {
        fetchUserPosts();
    } else if (activeTab === 'forums') {
        fetchForumPosts();
    }
  }, [activeTab, user, postIds]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
        {showHomepage ? (
            <div className="homepage">
                <div className="row justify-content-center">
                    <div className="col-md-8 text-center">
                        <h1>Welcome to Bee-Roll</h1>
                        <p>This website is a space for movie enthusiasts to discuss their favorite films, share viewing experiences, and connect with other movie lovers.</p>
                        <p>Please log in to start exploring and participating in the discussions!</p>
                    </div>
                </div>
            </div>
        ) : (
            <div>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => handleTabChange('posts')}>
                            Posts
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'forums' ? 'active' : ''}`} onClick={() => handleTabChange('forums')}>
                            Forums
                        </button>
                    </li>
                </ul>
                <div className="tab-content">
                    {activeTab === 'posts' && (
                        <div className="card-footer">
                            <h3 className="font-weight-bold">Posts</h3>
                            {posts.map((post) => (
                                <div key={post.postId} className="card mb-3">
                                    <div className="card-body">
                                        <h5 className="card-title">{post.postTitle}</h5>
                                        <p className="card-text">{post.postText}</p>
                                        <p className="card-text">Posted By: {post.user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'forums' && (
                        <div className="card-footer">
                            <h3 className="font-weight-bold">Forum Posts</h3>
                            {forumPosts.map((forumPost) => (
                                <div key={forumPost.postId} className="card mb-3">
                                    <div className="card-body">
                                        <h5 className="card-title">{forumPost.postTitle}</h5>
                                        <p className="card-text">{forumPost.postText}</p>
                                        <p className="card-text">Posted By: {forumPost.user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
);
};

export default HomePage;