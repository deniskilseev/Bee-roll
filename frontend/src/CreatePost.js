import React, { useState } from 'react';
import { useUser } from './UserContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate();
    const { forumName } = useParams()
    const [postTitle, setPostTitle] = useState('');
    const [postText, setPostText] = useState('');
    const { user } = useUser();
    console.log('user:', user)
    const userId = user.id;
    const token = user.token;

    // console.log('forumId:', params)

    const handleCreatePost = async () => {
        try {
            const newPost = {
                creatorId: userId,
                forumId: forumName,
                postTitle: postTitle,
                postText: postText,
            };
            console.log('New post:', newPost);

            // Send post data to the backend
            const headers = {
              'Authorization': `Bee-roll ${token}`,
              'Content-Type': 'application/json'
            };

            await axios.post('http://localhost:3000/posts/createPost', newPost, { headers });

            // Optionally, you can redirect the user to the forum page after post creation
            // navigate(`/forums/${forumId}`);

            // Clear input fields after successful post creation
            setPostTitle('');
            setPostText('');
            } catch (error) {
            console.error('Error creating post:', error);
            }
        };

  const handleCancel = () => {
    // Go back to the previous page
    navigate(-1);
  };

  return (
    <div className="container mt-5">
      <h1>Create Post</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="postTitle" className="form-label">Post Title:</label>
          <input type="text" className="form-control" id="postTitle" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="postText" className="form-label">Post Text:</label>
          <textarea className="form-control" id="postText" value={postText} onChange={(e) => setPostText(e.target.value)} />
        </div>
        <div className="mb-3">
          <button type="button" className="btn btn-primary mr-2" onClick={handleCreatePost}>Create Post</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
