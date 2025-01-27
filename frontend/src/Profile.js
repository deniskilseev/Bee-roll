import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import plusIcon from './assets/edit.png';
import blankProfilePic from './assets/blank profile pic.jpg';
import axios from 'axios';
import { useUser } from './UserContext';
import config from './config';

const Profile = () => {
  const { user, logout } = useUser();
  const token = user.token;
  const [isEditing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [profilePicture, setProfilePicture] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const { loading } = useUser();
  const profilePictureData = editedUser.userData.data_by_username.profilePicture.data;
  const byteArray = new Uint8Array(profilePictureData.data);
  const profilePictureSrc = `data:${editedUser.userData.data_by_username.profilePicture.type};base64,${btoa(String.fromCharCode.apply(null, byteArray))}`;

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const { username, password, email } = editedUser;
      // Dummy date of birth constant
      const dummyDateOfBirth = "1990-01-01";
      const oldUsername = user.userData.data_by_username.login;
      console.log('username:', username);

// Determine the username to use
      const updatedUsername = username === undefined ? oldUsername : username;
      console.log('updatedUsername:', updatedUsername);

      const updatedUser = {
        username: updatedUsername,
        email: user.email, // Keep the original email
        date_of_birth: dummyDateOfBirth // Use the dummy date of birth
      };

      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };

      if (profilePicture && isEditing) {
        const formData = new FormData();
        formData.append('profile-picture', profilePicture);
        const headers = {
          'Authorization': `Bee-roll ${token}`,
        };
        await axios.post(`${config.apiBaseUrl}/users/uploadProfilePicture`, formData, { headers });
      }

      const response = await axios.put(`${config.apiBaseUrl}/users/putuser`, updatedUser, { headers });

      if (response.status !== 200) {
        throw new Error('Failed to save changes');
      }

      setEditing(false);

      alert('Saved changes successfully. Please log in again to see the changes.');
      logout();
      navigate('/');

      console.log('Saved changes successfully', user, editedUser);
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
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleWatchlistsClick = () => {
    navigate('/watchlists');
  };


  useEffect(() => {
    const fetchPostData = async () => {
      if (user.userData && user.userData.data_by_username.postsIds) {
        try {
          const postsData = await Promise.all(
            user.userData.data_by_username.postsIds.map(async (postId) => {
              const headers = {
                'Authorization': `Bee-roll ${token}`,
                'Content-Type': 'application/json'
              };
              const postResponse = await axios.get(`${config.apiBaseUrl}/posts/getPost/${postId}`, { headers });
              const postData = postResponse.data.post_info;

              const userResponse = await axios.get(`${config.apiBaseUrl}/users/getUser/${postData.userId}`);
              const userData = userResponse.data.user_info;

              return { ...postData, user: userData.login };
            })
          );

          setPosts(postsData);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };

    fetchPostData();
  }, [user, token]);

  console.log(editedUser.userData.data_by_username.profilePicture);

  if (loading) {
    return <div>Loading...</div>;
  }

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
                      src={(profilePictureSrc && profilePictureSrc.length !== 13) ? profilePictureSrc : blankProfilePic}
                      alt="User Avatar"
                      className="avatar img-fluid"
                    />
                    <img
                      src={plusIcon}
                      alt="Edit Icon"
                      className="edit-icon ml-2"
                      style={{ width: '20px', height: '20px' }}
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
                <img
                  src={(profilePictureSrc && profilePictureSrc.length !== 13) ? profilePictureSrc : blankProfilePic}
                  alt="User Avatar"
                  className="avatar img-fluid"
                />
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
                  editedUser.userData?.data_by_username?.login
                )}
              </h2>
              <p className="bio text-center">
                {isEditing ? (
                  <input
                    type="text"
                    name="bio"
                    value={editedUser.userData.data_by_username.bio}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  editedUser.userData?.data_by_username?.bio || 'No bio available'
                )}
              </p>
              {editedUser.userData?.data_by_username?.warnings > 0 && (
                <div className="warning-level">
                  <p>Warning Level: {editedUser.userData.data_by_username.warnings} ({editedUser.userData.data_by_username.warningDescription})</p>
                </div>
              )}
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
                    to={`/followers/${editedUser.userData?.data_by_username?.username}`}
                    style={{ cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}
                  >
                    <div className='bio-follow-header'>
                      <h3 style={{ fontSize: 'inherit' }}>Followers</h3>
                      <p className='bio-follows'>{editedUser.userData?.data_by_username?.followersIds.length}</p>
                    </div>
                  </Link>
                </div>
                <div className="col-md-6 text-center">
                  <Link
                    to={`/following/${editedUser.userData?.data_by_username?.username}`}
                    style={{ cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}
                  >
                    <div className='bio-follow-header'>
                      <h3 style={{ fontSize: 'inherit' }}>Following</h3>
                      <p className='bio-follows'>{editedUser.userData?.data_by_username?.followsIds.length}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <h3 className="font-weight-bold">Posts</h3>
              {posts.map((post) => (
                <div key={post.postId} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{post.postTitle}</h5>
                    <p className="card-text">{post.postText}</p>
                    <p className="card-text">Posted By: {post.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;