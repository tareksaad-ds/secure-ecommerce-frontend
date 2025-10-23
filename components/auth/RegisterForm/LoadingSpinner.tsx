import React from 'react';

export function LoadingSpinner() {
  return (
    <svg
      className="loading-spinner"
      width="20"
      height="20"
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
  );
}
