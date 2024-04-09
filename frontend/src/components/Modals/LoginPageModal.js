import React, { useEffect, useState } from 'react';
import RegisterPageModal from './RegisterPageModal';
import { useUser } from '../../UserContext';

const LoginPageModal = ({ showModal, onClose }) => {
  const { updateUser } = useUser();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
      }
    }
  }, [showModal]);

  const handleClose = () => {
    const modalElement = document.getElementById('loginModal');

    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';

      setFormData({
        username: '',
        password: '',
      });

      onClose();
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterClick = () => {
    handleClose();

    setShowRegisterModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/users/loginUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Login successful');
        console.log('User data:', userData);

        updateUser(userData);
      } else {
        console.error('Login failed');
        // Handle failed login scenarios
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network or other errors
    }

    handleClose();
  };

  return (
    <>
    <div
      className={`modal fade ${showModal ? 'show' : ''}`}
      id="loginModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="loginModalLabel"
      aria-hidden={!showModal}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">Login</h5>
              <button type="button" className="close" onClick={handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <div className="text-center">
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="btn btn-link text-dark-blue p-0 m-0 pb-1"
                  onClick={handleRegisterClick}
                >
                  Register Here
                </button>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
    {showRegisterModal && (
      <RegisterPageModal
        showModal={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    )}
    </>
  );
};

export default LoginPageModal;
