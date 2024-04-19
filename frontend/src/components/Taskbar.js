// Taskbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginPageModal from './Modals/LoginPageModal';
import RegisterPageModal from './Modals/RegisterPageModal';
import { useUser } from '../UserContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const Taskbar = () => {
  const { user, logout } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogoutClick = () => {
    logout();
    Cookies.remove('beerollToken');
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

  const toggleUserSearchBar = () => {
    setShowUserSearch(!showUserSearch);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  const handleUserSearchChange = (event) => {
    const query = event.target.value;
    setUserSearchQuery(query);
    fetchUserSearchResults(query);
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
      const response = await axios.get(`http://localhost:3000/movies/getInfo/${movieId}`);
      
      navigate(`/movies/${movieId}`, { state: { movieInfo: response.data } });
    } catch (error) {
      console.error('Error fetching movie info:', error);
    }
  };

  const fetchUserSearchResults = async (query) => {
    try {
      console.log(`Sending request to: http://localhost:3000/users/search/${query}`);
      const response = await axios.get(`http://localhost:3000/users/search/${query}`);
      console.log('Search results:', response.data);
      setUserSearchResults(response.data.users.slice(0, 2));
    } catch (error) {
      console.error('Error fetching user search results:', error);
    }
  };

  const handleUserSearchResultClick = async (uid) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/getUser/${uid}`);
      const userData = response.data;
      const username = response.data.user_info.login;
      console.log("username: ", userData);
      
      navigate(`/user/profile/${username}`, { state: { userData: response.data } });
    } catch (error) {
      console.error('Error fetching movie info:', error);
    }
  };

  const handleWarnUser = async (userId) => {
    try {
      navigate('/warnedusers');
    } catch (error) {
      console.error('Error warning user:', error);
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
              <button className="btn btn-outline-light ml-2" onClick={toggleUserSearchBar}>
                <span className="d-inline-block text-center">{showUserSearch ? 'Hide Search' : 'Search Users'}</span>
              </button>
              <Link to="/createforum" className="btn btn-outline-light mr-2">
                  <span className="d-inline-block text-center">Create Forum</span>
              </Link>
              <Link to="/movies" className="btn btn-outline-light mr-2">
                <span className="d-inline-block text-center">Movies</span>
              </Link>
              <Link to="/profile" className="btn btn-outline-light mr-2">
                <span className="d-inline-block text-center">Profile</span>
              </Link>
              <Link to="/forumlist" className="btn btn-outline-light mr-2">
                <span className="d-inline-block text-center">Forum List</span>
              </Link>
              {user.userData.data_by_username.isAdmin && (
                <button className="btn btn-outline-light mr-2" onClick={handleWarnUser}>
                  <span className="d-inline-block text-center">Warned Users</span>
                </button>
              )}
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

        {showUserSearch && (
          <div className="input-group ml-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search Users..."
              value={userSearchQuery}
              onChange={handleUserSearchChange}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-light" type="button">Search Users</button>
            </div>
          </div>
        )}

        {showUserSearch && userSearchResults.length > 0 && (
          <ul className="list-group mt-2">
            {userSearchResults.map((user, index) => (
              <li key={index} className="list-group-item" onClick={() => handleUserSearchResultClick(user.uid)}>
                {user.login}
              </li>
            ))}
          </ul>
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
