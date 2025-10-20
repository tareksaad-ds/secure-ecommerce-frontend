import React from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  return (
    <div className={`alert alert-${type}`}>
      {type === 'success' ? (
        <FiCheckCircle size={20} />
      ) : (
        <FiAlertCircle size={20} />
      )}
      <span>{message}</span>
    </div>
  );
}
