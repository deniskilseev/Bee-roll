import React from 'react';

const Post = ({ title, content, author }) => {
  return (
    <div className="card my-3">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{content}</p>
        <div className="d-flex align-items-center">
          <img
            src={author.profilePicture}
            alt={`${author.username}'s profile`}
            className="rounded-circle mr-2"
            style={{ width: '30px', height: '30px', marginRight: '8px' }}
          />
          <p className="card-text">
            <small className="text-muted">
              Posted by {author.username}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
