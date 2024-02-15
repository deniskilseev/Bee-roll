// Homepage.js
import React from 'react';
import PostList from './PostList';

const HomePage = () => {
  const examplePosts = [
    { id: 1, title: 'First Post', content: 'First post.', author: 'User1' },
    { id: 2, title: 'Second Post', content: 'Second post.', author: 'User2' },
  ];

  return (
    <div>
      <div className="container mt-3">
        <PostList posts={examplePosts} />
      </div>
    </div>
  );
};

export default HomePage;