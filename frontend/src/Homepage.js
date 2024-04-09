import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import axios from 'axios';

const HomePage = () => {
    const { user } = useUser();
    const [posts, setPosts] = useState([]);
    const [postIds, setPostIds] = useState([]);

    useEffect(() => {
      const sendPostRequest = async () => {
        if (user.userData) {
          const token = user.userData.token;
          try {
            const headers = {
              'Authorization': `Bee-roll ${token}`,
              'Content-Type': 'application/json'
            };
            const response = await axios.post('http://localhost:3000/posts/getRecentPosts', {
                user_login: user.userData.data_by_username.login
            }, { headers });

            setPostIds(response.data);
            console.log(postIds)
          } catch (error) {
            console.error('Failed to retrieve posts:', error.message);
          }
        }
      };

      sendPostRequest();
  }, [user]);

  useEffect(() => {
    const fetchPostData = async () => {
      if (user.userData && postIds.posts) {
        const token = user.userData.token;
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
    
    fetchPostData();
  }, [user, postIds]);

  return (
    <div>
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
    </div>
  );
};

export default HomePage;