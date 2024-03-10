// CreateForumPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateForumPage = ({ onForumCreate }) => {
  const navigate = useNavigate();
  const [forumTitle, setForumTitle] = useState('');
  const [forumDescription, setForumDescription] = useState('');

  const handleCreateForum = async () => {
    const forumName = forumTitle.replace(/\s+/g, '-').toLowerCase();

    const newForum = {
      id: Date.now(),
      name: forumName,
      title: forumTitle,
      description: forumDescription,
    };

    //Api call here

    onForumCreate(newForum);

    navigate(`/f/${forumName}`);
  };

  const handleCancel = () => {
    navigate('/');
  };

  
  return (
    <div className="container mt-5">
      <h1>Create Forum</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="forumTitle" className="form-label">Forum Title:</label>
          <input type="text" className="form-control" id="forumTitle" value={forumTitle} onChange={(e) => setForumTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="forumDescription" className="form-label">Forum Description:</label>
          <textarea className="form-control" id="forumDescription" value={forumDescription} onChange={(e) => setForumDescription(e.target.value)} />
        </div>
        <div className="mb-3">
          <button type="button" className="btn btn-primary mr-2" onClick={handleCreateForum}>Create Forum</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateForumPage;
