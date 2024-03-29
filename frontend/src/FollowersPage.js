import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import profileIcon from './assets/blank profile pic.jpg';

const FollowersPage = () => {
  const { username } = useParams();
  const [followersUsers, setFollowersUsers] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/getUserByUsername/${username}`);

        const followersIds = response.data.user_info.followersIds;

        // Fetch followers users
        const followersUsersData = await Promise.all(followersIds.map(async (userId) => {
          const userResponse = await axios.get(`http://localhost:3000/users/getUser/${userId}`);
          return userResponse.data.user_info;
        }));

        // Store followers users in state
        setFollowersUsers(followersUsersData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [username]);

  console.log(followersUsers)

  return (
    <div className="container mt-4">
      <h2>Followers</h2>
      <div className="row">
        {followersUsers.map((follower) => (
          <div key={follower.id} className="col-2 col-sm-2 col-md-2 mb-2">
            <div className="card">
              <img
                src = {profileIcon}
                alt={`Profile of ${follower.login}`}
                className="card-img-top"
              />
              <div className="card-body text-center">
                <h5 className="card-title">{follower.login}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowersPage;
