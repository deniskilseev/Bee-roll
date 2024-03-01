// WritePost.js
import React, { useState } from 'react';

const WritePost = ({ onPost }) => {
  const [newPostText, setNewPostText] = useState('');

  const handlePostChange = (e) => {
    const text = e.target.value;
    // Limit the input to 5000 characters
    setNewPostText(text.slice(0, 5000));
  };

  const handlePostClick = () => {
    // Check if the character count is within the limit (not exceeding 5000)
    if (newPostText.length > 5000) {
      // Alert or handle the case where the character limit is exceeded
      alert('Character limit exceeded. Please limit your post to 5000 characters.');
      return;
    }

    // Proceed with posting if the character count is within the limit
    onPost({ id: Date.now(), content: newPostText }); // Example data, adjust as needed
    setNewPostText('');
  };

  const characterCount = newPostText.length;

  return (
    <div>
      <textarea value={newPostText} onChange={handlePostChange} />
      <p>Character Count: {characterCount} / 5000</p>
      <button onClick={handlePostClick}>Post</button>
    </div>
  );
};

export default WritePost;
