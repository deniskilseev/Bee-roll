import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreatePost = ({ user }) => {
    const navigate = useNavigate();
    const { forumName } = useParams()
    const [postTitle, setPostTitle] = useState('');
    const [postText, setPostText] = useState('');
    const userId = user.id;

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

            const headers = {
              'Authorization': 'Bee-roll ${authToken}',
              'Content-Type': 'application/json'
            };

            await axios.post('http://localhost:3000/posts/createPost', newPost, { headers });


            setPostTitle('');
            setPostText('');
            } catch (error) {
            console.error('Error creating post:', error);
            }
        };

  const handleCancel = () => {
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
