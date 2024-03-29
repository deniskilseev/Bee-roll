import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './styles/forumSettings.css'; // Import your CSS file for styling

const ForumSettings = ({ user }) => {
    const { forumName } = useParams();
    const [moderators, setModerators] = useState([]);
    const [forum, setForum] = useState(null);
    const [newModerator, setNewModerator] = useState('');
    const [isPublic, setIsPublic] = useState(true); // Default to public

    const handleAddModerator = async () => {
        if (newModerator && !moderators.includes(newModerator)) {
            try {
                // Send GET request to validate the user exists
                const userResponse = await axios.get(`http://localhost:3000/users/getUserByUsername/${newModerator}`);
                const userToAdd = userResponse.data.user_info;

                // If user exists, add moderator
                if (userToAdd) {
                    // Send POST request to add moderator
                    const moderatorData = {
                        to_add_id: userToAdd.uid,
                        who_adds_id: user.id,
                        forum_id: forum.forumId
                    };
                    await axios.post('http://localhost:3000/forums/addModerator', moderatorData);
                    setModerators([...moderators, newModerator]);
                    setNewModerator('');
                } else {
                    console.log('User does not exist.');
                }
            } catch (error) {
                console.error('Error adding moderator:', error);
            }
        }
    };

    const handleTogglePrivacy = () => {
        setIsPublic(prevState => !prevState);
        // Send POST request to toggle forum privacy
        axios.post('http://localhost:3000/forums/togglePrivate', {
            forumId: forum.forumId,
        })
        .then(response => {
            console.log('Privacy toggled successfully');
        })
        .catch(error => {
            console.error('Error toggling privacy:', error);
        });
    };

    useEffect(() => {
        const fetchForumData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/forums/${forumName}`);
                const fetchedForum = response.data;
                setForum(fetchedForum);
                setIsPublic(!fetchedForum.isPrivate);

                const moderatorPromises = fetchedForum.moderatorIds.map(async moderatorId => {
                    const userResponse = await axios.get(`http://localhost:3000/users/getuser/${moderatorId}`);
                    return userResponse.data;
                });

                const moderatorsData = await Promise.all(moderatorPromises);
                const moderatorUsernames = moderatorsData.map(moderator => moderator.user_info.login);
                setModerators(moderatorUsernames)
            } catch (error) {
                console.error('Error fetching forum:', error);
            }
        };
    
        fetchForumData();
    }, [forumName]);

    const handleDeleteModerator = async (moderator) => {
        // Implement moderator deletion logic here
        const userResponse = await axios.get(`http://localhost:3000/users/getUserByUsername/${moderator}`);

        console.log('Forum:', forum.forumId);

        axios.post('http://localhost:3000/forums/removeModerator', {
            to_remove_id: userResponse.data.user_info.uid,
            who_removes_id: user.id,
            forum_id: forum.forumId,
        })
        .then(response => {
            setModerators(prevModerators => prevModerators.filter(m => m !== moderator));
            console.log('Moderator Deleted Successfully');
        })
        .catch(error => {
            console.error('Error deleting moderator:', error);
        });
    };

    return (
        <div className="forum-settings-container">
        <h2>Forum Settings</h2>
            <div>
            <div className="moderators-section">
                <h3>Moderators:</h3>
                <ul>
                    {moderators.map((moderator, index) => (
                        <li key={index} className="moderator-item">
                            <span>{moderator}</span>
                            <button className="btn btn-danger" onClick={() => handleDeleteModerator(moderator)}>Delete</button>
                        </li>
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
