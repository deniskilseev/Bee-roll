// RegisterPageModal.js
import React from 'react';
import { Modal } from 'react-bootstrap';
import RegisterPage from '../Register'; // Adjust the import path as needed

const RegisterPageModal = ({ onClose }) => {
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RegisterPage onClose={onClose} />
      </Modal.Body>
    </Modal>
  );
};

export default RegisterPageModal;
