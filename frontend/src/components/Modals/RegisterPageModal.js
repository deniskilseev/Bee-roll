import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import LoginPageModal from './LoginPageModal';

const RegisterPageModal = ({ showModal, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginClick = () => {
    onClose(); // Close the registration modal first
    console.log("Before set: ", showLoginModal);
    setShowLoginModal(true); // Close the registration modal when opening the login modal
    console.log("After set: ", showLoginModal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/createuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('User created successfully');
      } else {
        console.error('Failed to create user');
        // Handle error scenarios
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network or other errors
    }

    onClose();
  };

  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
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

          <div className="modal-footer d-flex justify-content-center">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
            <div className="text-center">
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="btn btn-link text-dark-blue p-0 m-0 pb-1"
                  onClick={handleLoginClick}
                >
                  Login Here
                </button>
              </p>
            </div>
        </form>
      </Modal.Body>
      {showLoginModal && <LoginPageModal showModal={showLoginModal} onClose={() => setShowLoginModal(false)} />}
    </Modal>
  );
};

export default RegisterPageModal;
