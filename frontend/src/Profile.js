import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PostList from './components/PostList';
import 'bootstrap/dist/css/bootstrap.min.css';
import plusIcon from './assets/edit.png';
import axios from 'axios';
import { useUser } from './UserContext';

const Profile = ({ user }) => {
  const [isEditing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const { username, password, email } = editedUser;
      // Dummy date of birth constant
      const dummyDateOfBirth = "1990-01-01"; // Modify as needed
  
      const updatedUser = {
        oldUser: user.username,
        username,
        email: user.email, // Keep the original email
        date_of_birth: dummyDateOfBirth // Use the dummy date of birth
      };

      console.log(updatedUser)
  
      const response = await axios.put('http://localhost:3000/users/putuser', updatedUser, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to save changes');
      }

      updateUser({ ...editedUser});
  
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelClick = () => {
    setEditedUser({ ...user });
    setEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    // const file = e.target.files[0];
    // Add logic to handle image change and update editedUser.profilePicture
  };

  const handleWatchlistsClick = () => {
    navigate('/watchlists');
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header text-center">
              {isEditing && (
                <label htmlFor="profile-picture" className="edit-profile-picture">
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={editedUser.profilePicture || plusIcon}
                      alt="User Avatar"
                      className="avatar img-fluid"
                    />
                    <img
                      src={plusIcon}
                      alt="Edit Icon"
                      className="edit-icon ml-2"
                      style={{ width: '20px', height: '20px'}}
                    />
                  </div>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
              {!isEditing && (
                <img src={editedUser.profilePicture} alt="User Avatar" className="avatar img-fluid" />
              )}
              <h2 className="username mt-3">
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username}
                    onChange={handleInputChange}
                    className="form-control text-center"
                  />
                ) : (
                  editedUser.username
                )}
              </h2>
              <p className="bio text-center">
                {isEditing ? (
                  <input
                    type="text"
                    name="bio"
                    value={editedUser.bio}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  editedUser.bio || 'No bio available'
                )}
              </p>
              {isEditing && (
                <div className="d-flex justify-content-center">
                  <button onClick={handleSaveClick} style={{ marginRight: '5px' }} className="btn btn-primary mr-2">
                    Save
                  </button>
                  <button onClick={handleCancelClick} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              )}
              {!isEditing && (
                <div className="d-flex justify-content-center">
                  <button onClick={handleEditClick} style={{ marginRight: '5px' }} className="btn btn-info mt-2">
                    Edit
                  </button>
                  <button onClick={handleWatchlistsClick} className="btn btn-info mt-2">
                    Watchlists
                  </button>
                </div>
              )}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 text-center">
                  <Link
                      to="/followers"
                      style={{ cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}
                    >
                      <div className='bio-follow-header'>
                        <h3 style={{ fontSize: 'inherit' }}>Followers</h3>
                        <p className='bio-follows'>{editedUser.followers.length}</p>
                      </div>
                  </Link>
                </div>
                <div className="col-md-6 text-center">
                    <Link
                        to="/following"
                        style={{ cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}
                      >
                        <div className='bio-follow-header'>
                          <h3 style={{ fontSize: 'inherit' }}>Following</h3>
                          <p className='bio-follows'>{editedUser.following.length}</p>
                        </div>
                    </Link>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <h3 className="font-weight-bold">Posts</h3>
              <PostList posts={editedUser.posts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
