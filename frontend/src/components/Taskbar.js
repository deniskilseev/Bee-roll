// Taskbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginPageModal from './Modals/LoginPageModal';
import RegisterPageModal from './Modals/RegisterPageModal';
import { useUser } from '../UserContext';

const Taskbar = () => {
  const { user, logout } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogoutClick = () => {
    logout();
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

  return (
    <header className={`navbar navbar-dark bg-dark ${showLoginModal ? 'overlay' : ''}`}>
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">Bee-Roll</Link>

        <div>
          {user ? (
            <div>
              <Link to="/profile" className="btn btn-outline-light mr-2">
                <span className="d-inline-block text-center">Profile</span>
              </Link>
              <button className="btn btn-outline-light" onClick={handleLogoutClick}>
                <span className="d-inline-block text-center">Logout</span>
              </button>
            </div>
          ) : (
            <div>
            <Link to="/createforum" className="btn btn-outline-light mr-2">
                <span className="d-inline-block text-center">Create Forum</span>
            </Link>
            <button className="btn btn-outline-light" onClick={handleLoginClick}>
              <span className="d-inline-block text-center">Login</span>
            </button>
            </div>
          )}
        </div>

        <LoginPageModal showModal={showLoginModal} onClose={handleCloseModal} />
        <RegisterPageModal showModal={showRegisterModal} onClose={handleRegisterModal} />
      </div>
    </header>
  );
};

export default Taskbar;
