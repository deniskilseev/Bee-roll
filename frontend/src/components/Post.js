import React from 'react';

const Post = ({ title, content, author }) => {
  return (
    <div className="card my-3">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{content}</p>
        <p className="card-text"><small className="text-muted">Posted by {author}</small></p>
      </div>
    </div>
  );
};

export default Post;
