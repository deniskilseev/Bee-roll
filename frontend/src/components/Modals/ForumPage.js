// ForumPage.js
import React, { useState } from 'react';
import PostList from '../PostList';
import WritePost from '../WritePost';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div style={styles.forumPageContainer}>
      <h5 style={styles.forumHeading}>Forum Page</h5>
      <button style={styles.createPostButton} onClick={handleNavigateToWritePost}>
        Create Post
      </button>
      {showPostForm && <WritePost onPost={handleCreatePost} />} {/* Ensure onPost is passed correctly */}
      <PostList posts={posts} onDelete={handleDeletePost} />
    </div>
  );
};

const styles = {
  forumPageContainer: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
  },
  forumHeading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  createPostButton: {
    backgroundColor: '#007bff', // Bootstrap primary color
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default ForumPage;
