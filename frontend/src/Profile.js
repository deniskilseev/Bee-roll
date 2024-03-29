import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PostList from './components/PostList';
import 'bootstrap/dist/css/bootstrap.min.css';
import plusIcon from './assets/edit.png';
import axios from 'axios';
import { useUser } from './UserContext';

const Profile = ({ user }) => {
  const [isEditing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const [profilePicture, setProfilePicture] = useState(null);

  const { updateUser } = useUser();
  const navigate = useNavigate();

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      //const { posts, id, ...userWithoutPosts } = editedUser;

      console.log(editedUser) //print edits to console
      const { username, bio, profilePicture } = editedUser;

      const userWithoutPosts = {
        uid: user.id, // Assuming user object has uid field
        username,
        bio,
        profilePicture
      };
  
      const response = await fetch('http://localhost:3000/profile/updateprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userWithoutPosts),
      });
      console.log("Testing the body: ", JSON.stringify(userWithoutPosts));
  
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
  
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    console.log("file? ", file)
    formData.append('profilePicture', file);
    formData.append('userId', user.id);
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }

    console.log("formData: ", formData);

    try {
      const response = await fetch('http://localhost:3000/profile/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }
      const responseData = await response.json(); // Parse JSON once
      setProfilePicture(responseData.profilePicture);
      setEditedUser(prevUser => ({ ...prevUser, profilePicture: responseData.profilePicture })); // Update editedUser state with the new profile picture
      if (response.ok) {
        console.log('Profile retrieved', responseData);
        updateUser(responseData);
        navigate(`/profile/${responseData.userId}`); // Redirect to the profile page
      } else {
        console.error('Retrieval failed');
        // Handle failed scenarios
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
      // Handle error (e.g., display error message to the user)
    }
  };
  
  

  const handleWatchlistsClick = () => {
    navigate('/watchlists');
  };


  useEffect(() => {
    const fetchPostData = async () => {
      if (user && user.posts) { // Check if user and user.postsIds are not null
        try {
          const postsData = await Promise.all(
            user.posts.map(async (postId) => {
              const postResponse = await axios.get(`http://localhost:3000/posts/getPost/${postId}`);
              const postData = postResponse.data.post_info;
    
              // Fetch user data for the post
              const userResponse = await axios.get(`http://localhost:3000/users/getUser/${postData.userId}`);
              const userData = userResponse.data.user_info;
    
              // Combine post data with user data
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
  }, [user]);

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
                      to={`/followers/${editedUser.username}`}
                      style={{ cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}
                    >
                      <div className='bio-follow-header'>
                        <h3 style={{ fontSize: 'inherit' }}>Followers</h3>
                        {editedUser.followers && (
                        <p className='bio-follows'>{editedUser.followers.length}</p>
                        )}
                      </div>
                  </Link>
                </div>
                <div className="col-md-6 text-center">
                    <Link
                        to={`/following/${editedUser.username}`}
                        style={{ cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}
                      >
                        <div className='bio-follow-header'>
                          <h3 style={{ fontSize: 'inherit' }}>Following</h3>
                          {editedUser.following && (
                          <p className='bio-follows'>{editedUser.following.length}</p>
                          )}
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
