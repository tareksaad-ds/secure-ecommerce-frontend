import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { LoginFormData } from './loginSchema';

interface RememberMeCheckboxProps {
  register: UseFormRegister<LoginFormData>;
  disabled?: boolean;
}

export function RememberMeCheckbox({
  register,
  disabled,
}: RememberMeCheckboxProps) {
  return (
    <div className="remember-me-field">
      <label className="remember-me-label">
        <input
          type="checkbox"
          className="checkbox-input"
          {...register('rememberMe')}
          disabled={disabled}
        />
        <span className="checkbox-custom" />
        <span className="checkbox-text">Remember me</span>
      </label>
    </div>
  );
}
