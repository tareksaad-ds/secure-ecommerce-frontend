'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import './AlertModal.css';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error';
  showLoginButton?: boolean;
}

function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  showLoginButton = false,
}: AlertModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLoginClick = () => {
    onClose();
    router.push('/auth');
  };

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div
        className={`alert-modal ${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={24} />
        </button>

        {/* Icon */}
        <div className="modal-icon">
          <FiAlertCircle size={48} />
        </div>

        {/* Content */}
        <div className="modal-content">
          <h2 className="modal-title">{title}</h2>
          <p className="modal-message">{message}</p>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          {showLoginButton && (
            <button className="modal-button primary" onClick={handleLoginClick}>
              Login / Sign Up
            </button>
          )}
          <button className="modal-button secondary" onClick={onClose}>
            {showLoginButton ? 'Continue Shopping' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
