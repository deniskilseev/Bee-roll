import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ForumPage = ({ forums, currentUser }) => {
  const { forumName } = useParams();

  const forum = forums.find((forum) => forum.name === forumName);
  const [moderators, setModerators] = useState(forum.moderators || []);
  const [newModerator, setNewModerator] = useState('');
  const [isOwner, setIsOwner] = useState(currentUser === forum.owner);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  

  if (!forum) {
    return <div>Forum not found!</div>;
  }

  const dummyPosts = [
    { id: 1, title: 'Post 1', content: 'Content of post 1' },
    { id: 2, title: 'Post 2', content: 'Content of post 2' },
    { id: 3, title: 'Post 3', content: 'Content of post 3' },
  ];

  const handlePinClick = (postId) => {
    // Handle pin button click
    console.log(`Pin clicked for post ${postId}`);
  };

  const handleAddModerator = () => {
    if (newModerator && !moderators.includes(newModerator)) {
      setModerators([...moderators, newModerator]);
      setNewModerator('');
    }
  };

  const handleDeleteClick = (postId) => {
    // Handle delete button click
    console.log(`Delete clicked for post ${postId}`);
  };

  return (
    <div className="container mt-5">
      <h1>{forum.title}</h1>

      <div className="mb-3">
        <button className="btn btn-primary">Create Post</button>
      </div>

      {isOwner && (
        <div className="mb-3">
          <button className="btn btn-primary" onClick={() => setIsSearchVisible(!isSearchVisible)}>
            {isSearchVisible ? 'Hide Moderator Search' : 'Show Moderator Search'}
          </button>
        </div>
      )}

      {isOwner && isSearchVisible && (
        <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            value={newModerator}
            onChange={(e) => setNewModerator(e.target.value)}
            className="form-control"
            placeholder="Enter username of new moderator"
          />
          <div className="input-group-append">
            <button className="btn btn-success" onClick={handleAddModerator}>Add Moderator</button>
          </div>
        </div>
      </div>
      )}

      <div>
        <h3>Moderators:</h3>
        <ul>
          {moderators.map((moderator, index) => (
            <li key={index}>{moderator}</li>
          ))}
        </ul>
      </div>

      {dummyPosts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.content}</p>
            <button className="btn btn-outline-primary mr-2" onClick={() => handlePinClick(post.id)}>Pin</button>
            <button className="btn btn-outline-danger" onClick={() => handleDeleteClick(post.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumPage;
