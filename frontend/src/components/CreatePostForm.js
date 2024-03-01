import React, { useState } from 'react';

const CreatePostForm = ({ onCreatePost }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');

  const handleCreatePost = () => {
    // Add validation if needed
    onCreatePost({ postTitle, postText });
    setPostTitle('');
    setPostText('');
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <label>Title:</label>
      <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
      <label>Text:</label>
      <textarea value={postText} onChange={(e) => setPostText(e.target.value)} />
      <button onClick={handleCreatePost}>Create Post</button>
    </div>
  );
};

export default CreatePostForm;
