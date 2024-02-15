import React from 'react';
import Post from './Post';

const PostList = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} title={post.title} content={post.content} author={post.author} />
      ))}
    </div>
  );
};

export default PostList;
