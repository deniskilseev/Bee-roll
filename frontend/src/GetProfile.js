import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostList from './components/PostList';
import 'bootstrap/dist/css/bootstrap.min.css';
import plusIcon from './assets/edit.png';

const GetProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/getUserProfile/${username}', {
          method: 'GET',
          headers: {
            // Include any necessary headers, such as authorization if needed
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const userData = await response.json();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // The empty dependency array ensures the effect runs only once on mount

  const handleEditClick = () => {
    // Add your edit logic here
  };

  const handleWatchlistsClick = () => {
    navigate('/watchlists');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mt-4">
      {/* Rest of the component code remains the same */}
      {/* ... */}
    </div>
  );
};

export default GetProfile;
