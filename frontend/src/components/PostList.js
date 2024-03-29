// PostList.js
import React from 'react';

// PostList.js
const PostList = ({ posts, onDelete }) => {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          {/* Render post content */}
          <p>{post.content}</p>
          {/* Button to delete the post */}
          <button onClick={() => onDelete(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};


export default PostList;

