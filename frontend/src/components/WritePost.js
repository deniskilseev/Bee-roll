// WritePost.js
import React, { useState } from 'react';

const WritePost = ({ onPost }) => {
  const [newPostText, setNewPostText] = useState('');

  const handlePostChange = (e) => {
    setNewPostText(e.target.value);
  };

  const handlePostClick = () => {
    onPost({ id: Date.now(), content: newPostText }); // Example data, adjust as needed
    setNewPostText('');
  };

  return (
    <div>
      <textarea value={newPostText} onChange={handlePostChange} />
      <button onClick={handlePostClick}>Post</button>
    </div>
  );
};

export default WritePost;
