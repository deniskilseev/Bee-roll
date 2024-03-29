import React, { useState } from 'react';
import axios from 'axios';
import './styles/forumSettings.css'; // Import your CSS file for styling

const ForumSettings = ({ isOwner }) => {
  const [moderators, setModerators] = useState([]);
  const [newModerator, setNewModerator] = useState('');
  const [isPublic, setIsPublic] = useState(true); // Default to public

  const handleAddModerator = () => {
    if (newModerator && !moderators.includes(newModerator)) {
      setModerators([...moderators, newModerator]);
      setNewModerator('');
    }
  };

  const handleTogglePrivacy = () => {
    setIsPublic(prevState => !prevState);
    // Additional logic to update forum privacy status in the backend
  };

  return (
    <div className="forum-settings-container">
      <h2>Forum Settings</h2>
        <div>
          <div className="moderators-section">
            <h3>Moderators:</h3>
            <ul>
              {moderators.map((moderator, index) => (
                <li key={index}>{moderator}</li>
              ))}
            </ul>
            <div className="input-group">
              <input
                type="text"
                value={newModerator}
                onChange={(e) => setNewModerator(e.target.value)}
                placeholder="Enter username of new moderator"
              />
              <button className="btn btn-success" onClick={handleAddModerator}>Add Moderator</button>
            </div>
          </div>
          <div className="privacy-section">
            <label className="privacy-label">
              <input
                type="checkbox"
                checked={!isPublic}
                onChange={handleTogglePrivacy}
              />
              <span className="privacy-slider"></span>
            </label>
            <span className="privacy-text">{isPublic ? 'Public Forum' : 'Private Forum'}</span>
          </div>
        </div>
    </div>
  );
};

export default ForumSettings;
