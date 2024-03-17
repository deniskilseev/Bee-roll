import React from 'react';

const FollowingPage = () => {
  // Dummy data for following
  const dummyFollowing = [
    { id: 1, username: 'Following1' },
    { id: 2, username: 'Following2' },
    { id: 3, username: 'Following3' },
  ];

  return (
    <div className="container mt-4">
      <h2>Following</h2>
      <div className="row">
        {dummyFollowing.map((following) => (
          <div key={following.id} className="col-2 col-sm-2 col-md-2 mb-2">
            <div className="card">
              <img
                src="blank profile pic.jpg"
                alt={`Profile of ${following.username}`}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{following.username}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowingPage;
