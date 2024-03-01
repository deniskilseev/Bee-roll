// WritePost.js
import React, { useState } from 'react';

const WritePost = ({ onPost }) => {
  const [newPostText, setNewPostText] = useState('');

  const handlePostChange = (e) => {
    const text = e.target.value;
    setNewPostText(text);
  };

  const handlePostClick = () => {
    onPost({ id: Date.now(), content: newPostText }); // Example data, adjust as needed
    setNewPostText('');
  };

  const characterCount = newPostText.length;

  return (
    <div>
      <textarea value={newPostText} onChange={handlePostChange} />
      <p>Character Count: {characterCount}</p>
      <button onClick={handlePostClick}>Post</button>
    </div>
  );
};

export default WritePost;
