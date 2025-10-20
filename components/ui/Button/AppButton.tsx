'use client';

import React from 'react';
import './AppButton.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

function AppButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const classes = [
    'app-button',
    variant !== 'primary' ? variant : '',
    size !== 'medium' ? size : '',
    fullWidth ? 'full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

export default AppButton;
