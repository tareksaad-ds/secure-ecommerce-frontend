'use client';

import React, { useState, forwardRef, useId } from 'react';
import './AppInput.css';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'filled' | 'outlined' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showPasswordToggle?: boolean;
  success?: boolean;
  loading?: boolean;
}

const AppInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'outlined',
      size = 'medium',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      showPasswordToggle = false,
      success = false,
      loading = false,
      disabled = false,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(
      !!props.value || !!props.defaultValue
    );

    const reactId = useId();
    const inputId = id || reactId;
    const inputType = type === 'password' && showPassword ? 'text' : type;

    const wrapperClasses = [
      'app-input-wrapper',
      variant,
      size,
      fullWidth ? 'full-width' : '',
      error ? 'error' : '',
      success ? 'success' : '',
      disabled ? 'disabled' : '',
      isFocused ? 'focused' : '',
      hasValue || isFocused ? 'has-value' : '',
      loading ? 'loading' : '',
      icon ? `icon-${iconPosition}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={wrapperClasses}>
        <div className="app-input-container">
          {/* Icon - Left Position */}
          {icon && iconPosition === 'left' && (
            <span className="app-input-icon left-icon">{icon}</span>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className="app-input"
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label htmlFor={inputId} className="app-input-label">
              {label}
            </label>
          )}

          {/* Icon - Right Position */}
          {icon && iconPosition === 'right' && !showPasswordToggle && (
            <span className="app-input-icon right-icon">{icon}</span>
          )}

          {/* Password Toggle */}
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              className="app-input-password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}

          {/* Loading Spinner */}
          {loading && (
            <span className="app-input-loading">
              <svg
                className="spinner"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="spinner-circle"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  strokeWidth="3"
                />
              </svg>
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <span
            id={`${inputId}-error`}
            className="app-input-message error-message"
          >
            {error}
          </span>
        )}

        {/* Helper Text */}
        {!error && helperText && (
          <span
            id={`${inputId}-helper`}
            className="app-input-message helper-text"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

AppInput.displayName = 'AppInput';

export default AppInput;
