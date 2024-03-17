import React from 'react';

const FollowersPage = () => {
  // Dummy data for followers
  const dummyFollowers = [
    { id: 1, username: 'Follower1' },
    { id: 2, username: 'Follower2' },
    { id: 3, username: 'Follower3' },
  ];

  return (
    <div className="container mt-4">
      <h2>Followers</h2>
      <div className="row">
        {dummyFollowers.map((follower) => (
          <div key={follower.id} className="col-2 col-sm-2 col-md-2 mb-2">
            <div className="card">
              <img
                src="blank profile pic.jpg"
                alt={`Profile of ${follower.username}`}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{follower.username}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowersPage;
