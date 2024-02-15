import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginPageModal from './Modals/LoginPageModal';

const Taskbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <header className={`navbar navbar-dark bg-dark ${showLoginModal ? 'overlay' : ''}`}>
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">Bee-Roll</Link>
        
        <button className="btn btn-outline-light" onClick={handleLoginClick}>
          <span className="d-inline-block text-center">Login</span>
        </button>

        <LoginPageModal showModal={showLoginModal} onClose={handleCloseModal} />
      </div>
    </header>
  );
};

export default Taskbar;
