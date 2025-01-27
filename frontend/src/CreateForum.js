// CreateForumPage.js
import React, { useState } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from './config';

const CreateForumPage = () => {
  const navigate = useNavigate();
  const [forumTitle, setForumTitle] = useState('');
  const [forumDescription, setForumDescription] = useState('');
  const { user } = useUser();
  const token = user.token;

  const handleCreateForum = async () => {
    try {
        // TODO: Forums not being created correctly
        const forumName = forumTitle.replace(/\s+/g, '-').toLowerCase();

        // Check if forumTitle contains special characters or spaces
        if (/[^a-zA-Z0-9-]/.test(forumTitle)) {
            throw new Error('Forum title should not contain special characters or spaces');
        }

        console.log(user);

        const newForum = {
            forumTitle: forumTitle,
        };

        const headers = {
            'Authorization': `Bee-roll ${token}`,
            'Content-Type': 'application/json'
        };

        await axios.post(`${config.apiBaseUrl}/forums/createForum`, newForum, { headers });

        navigate(`/forums/${forumName}`);
    } catch (error) {
        console.error('Error creating forum:', error);
        // Show a message to the user
        alert('Error creating forum: Forum title should not contain special characters or spaces');
    }
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