import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import profileIcon from './assets/blank profile pic.jpg';

const FollowingPage = () => {
  const { username } = useParams();
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/getUserByUsername/${username}`);

        const followsIds = response.data.user_info.followsIds;

        // Fetch followed users
        const followedUsersData = await Promise.all(followsIds.map(async (userId) => {
          const userResponse = await axios.get(`http://localhost:3000/users/getUser/${userId}`);
          return userResponse.data.user_info;
        }));

        // Store followed users in state
        setFollowedUsers(followedUsersData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [username]);

  console.log(followedUsers)

  return (
    <div className="container mt-4">
      <h2>Following</h2>
      <div className="row">
        {followedUsers.map((following) => (
          <div key={following.id} className="col-2 col-sm-2 col-md-2 mb-2">
            <div className="card">
              <img
                src = {profileIcon}
                alt={`Profile of ${following.login}`}
                className="card-img-top"
              />
              <div className="card-body text-center">
                <h5 className="card-title">{following.login}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowingPage;
