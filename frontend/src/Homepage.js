import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import axios from 'axios';

const HomePage = () => {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [postIds, setPostIds] = useState([]);
    const [forumPosts, setForumPosts] = useState([]);

    useEffect(() => {
      const sendPostRequest = async () => {
        if (user.userData) {
          const token = user.token;
          try {
            const headers = {
              'Authorization': `Bee-roll ${token}`,
              'Content-Type': 'application/json'
            };
            const response = await axios.post('http://localhost:3000/posts/getRecentPosts', {
                user_login: user.userData.data_by_username.login
            }, { headers });

            setPostIds(response.data);
          } catch (error) {
            console.error('Failed to retrieve posts:', error.message);
          }
        }
      };

      sendPostRequest();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'posts') {
        fetchUserPosts();
    } else if (activeTab === 'forums') {
        fetchForumPosts();
    }
  }, [activeTab, user, postIds]);

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
              const postResponse = await axios.get(`http://localhost:3000/posts/getPost/${postId}`, { headers });
              const postData = postResponse.data.post_info;

              const userResponse = await axios.get(`http://localhost:3000/users/getUser/${postData.userId}`);
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
          const forumsResponse = await axios.get('http://localhost:3000/forums/', { headers });
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
              const postResponse = await axios.get(`http://localhost:3000/posts/getPost/${postId}`, { headers });
              const postData = postResponse.data.post_info;

              const userResponse = await axios.get(`http://localhost:3000/users/getUser/${postData.userId}`);
              const userData = userResponse.data.user_info;
    
              return { ...postData, user: userData.login };
            }))
            
            setForumPosts(postsData);
        } catch (error) {
            console.error('Error fetching forum posts:', error);
        }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
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
  );
};

export default HomePage;