// ForumPage.js
import React, { useState } from 'react';
import PostList from '../PostList';
import WritePost from '../WritePost';
import { useNavigate } from 'react-router-dom';

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const navigate = useNavigate();

  const handleCreatePost = (newPost) => {
    // Assuming newPost has an 'id' and 'content' property
    const updatedPosts = [...posts, newPost];
  
    setPosts(updatedPosts);
    setShowPostForm(false);
  };

  const handleDeletePost = (postId) => {
    // Implement the logic to delete a post
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleNavigateToWritePost = () => {
    setShowPostForm(true); // Show the post form
  };

  return (
    <div>
      <h5>Forum Page</h5>
      <button onClick={handleNavigateToWritePost}>Create Post</button>
      {showPostForm && <WritePost onPost={handleCreatePost} />} {/* Ensure onPost is passed correctly */}
      <PostList posts={posts} onDelete={handleDeletePost} />
    </div>
  );
};

export default ForumPage;
