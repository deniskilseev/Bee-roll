// Taskbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginPageModal from './Modals/LoginPageModal';
import RegisterPageModal from './Modals/RegisterPageModal';
import { useUser } from '../UserContext';
import axios from 'axios';

const Taskbar = () => {
  const { user, logout } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    console.log('Logged out: ', user);
  }, [user]);

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(`http://localhost:3000/movies/find/${query}`);
      console.log('Search results:', response.data);
      setSearchResults(response.data.foundMovies.slice(0, 5));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearchResultClick = async (movieId) => {
    try {
      console.log(movieId);
      const response = await axios.get(`http://localhost:3000/movies/getInfo/${movieId}`);
      
      console.log('Movie info:', response.data);

      navigate(`/movies/${movieId}`, { state: { movieInfo: response.data } });
    } catch (error) {
      console.error('Error fetching movie info:', error);
    }
  };

  return (
    <header className={`navbar navbar-dark bg-dark ${showLoginModal ? 'overlay' : ''}`}>
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">Bee-Roll</Link>

        <div className="btn-group mr-2">
          {user.userData ? (
            <div>
              <button className="btn btn-outline-light ml-2" onClick={toggleSearchBar}>
                <span className="d-inline-block text-center">{showSearchBar ? 'Hide Search' : 'Search'}</span>
              </button>
              <Link to="/createforum" className="btn btn-outline-light mr-2">
                  <span className="d-inline-block text-center">Create Forum</span>
              </Link>
              <Link to="/profile" className="btn btn-outline-light mr-2">
                <span className="d-inline-block text-center">Profile</span>
              </Link>
              <button className="btn btn-outline-light" onClick={handleLogoutClick}>
                <span className="d-inline-block text-center">Logout</span>
              </button>
            </div>
          ) : (
            <div>
              <button className="btn btn-outline-light" onClick={handleLoginClick}>
                <span className="d-inline-block text-center">Login</span>
              </button>
            </div>
          )}
        </div>
        
        {showSearchBar && (
          <div className="input-group ml-2">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-light" type="button">Search</button>
            </div>
          </div>
        )}

        {showSearchBar && searchResults.length > 0 && (
          <ul className="list-group mt-2">
            {searchResults.map((result, index) => (
              <li key={index} className="list-group-item" onClick={() => handleSearchResultClick(result.movieId)}>
                {result.title}
              </li>
            ))}
          </ul>
        )}

        <LoginPageModal showModal={showLoginModal} onClose={handleCloseModal} />
        <RegisterPageModal showModal={showRegisterModal} onClose={handleRegisterModal} />
      </div>
    </header>
  );
};

export default Taskbar;
