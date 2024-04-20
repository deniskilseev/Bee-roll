import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/forumSettings.css';
import { useUser } from './UserContext';
import config from './config';

function checkAlias(string) {
    const regexp = new RegExp("^[a-z0-9]+$");
    return regexp.test(string);
}

const ForumSettings = () => {
    const { forumName } = useParams();
    const [moderators, setModerators] = useState([]);
    const [forum, setForum] = useState(null);
    const [newModerator, setNewModerator] = useState('');
    const [newAlias, setNewAlias] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const { user } = useUser();
    const token = user.token;
    const navigate = useNavigate();

    const handleAddModerator = async () => {
        if (newModerator && !moderators.includes(newModerator)) {
            try {
                const userResponse = await axios.get(`${config.apiBaseUrl}/users/getUserByUsername/${newModerator}`);
                const userToAdd = userResponse.data.user_info;

                if (userToAdd) {
                    const moderatorData = {
                        userId: userToAdd.uid,
                        forumId: forum.forumId
                    };

                    const headers = {
                        'Authorization': `Bee-roll ${token}`,
                        'Content-Type': 'application/json'
                    };

                    await axios.post(`${config.apiBaseUrl}/forums/addModerator`, moderatorData, { headers });
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

    const handleChangeAlias = async () => {
        try {
            if (newAlias && newAlias !== forumName) {
                if (checkAlias(newAlias)) {
                    const aliasData = {
                        forumId: forum.forumId,
                        forumTitle: newAlias
                    }

                    const headers = {
                        'Authorization': `Bee-roll ${token}`,
                        'Content-Type': 'application/json'
                    };

                    const serverResponse = await axios.put(`${config.apiBaseUrl}/forums/changeTitle`, aliasData, { headers });

                    if (serverResponse.status === 200) {
                        //forumName = newAlias;
                        console.log("Changed the name to", newAlias);
                        //fetchForumData();
                        navigate(`/forums/${newAlias}`);
                        setNewAlias('');
                    } else {
                        console.log('Another forum has such alias');
                    }
                } else {
                    console.log('Invalid Alias');
                }
            } else {
                console.log('Invalid Alias');
            }
            setNewAlias('');
        } catch (error) {
            console.error('Error in changing alias:', error);
        }
    }

    const handleTogglePrivacy = () => {
        setIsPublic(prevState => !prevState);

        const headers = {
            'Authorization': `Bee-roll ${token}`,
            'Content-Type': 'application/json'
        };

        axios.post(`${config.apiBaseUrl}/forums/togglePrivate`, {
            forumId: forum.forumId,
        }, { headers })
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
                const response = await axios.get(`${config.apiBaseUrl}/forums/${forumName}`);
                const fetchedForum = response.data;
                setForum(fetchedForum);
                setIsPublic(!fetchedForum.isPrivate);

                const moderatorPromises = fetchedForum.moderatorIds.map(async moderatorId => {
                    const userResponse = await axios.get(`${config.apiBaseUrl}/users/getuser/${moderatorId}`);
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
        const userResponse = await axios.get(`${config.apiBaseUrl}/users/getUserByUsername/${moderator}`);

        console.log('Forum:', forum.forumId);

        const headers = {
            'Authorization': `Bee-roll ${token}`,
            'Content-Type': 'application/json'
        };

        axios.post(`${config.apiBaseUrl}/forums/removeModerator`, {
            userId: userResponse.data.user_info.uid,
            forumId: forum.forumId,
        }, { headers })
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
            <div className="alias-section">
                <div className="input-group">
                    <input
                        type="text"
                        value={newAlias}
                        onChange={(e) => setNewAlias(e.target.value)}
                        placeholder="Enter new alias for the Forum"
                    />
                    <button className="btn btn-success" onClick={handleChangeAlias}>Change Alias</button>
                </div>
            </div>
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
