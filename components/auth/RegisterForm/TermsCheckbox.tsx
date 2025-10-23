import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { RegisterFormData } from './registerSchema';

interface TermsCheckboxProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  disabled?: boolean;
}

export function TermsCheckbox({
  register,
  errors,
  disabled,
}: TermsCheckboxProps) {
  return (
    <div className="checkbox-field">
      <label className="checkbox-label">
        <input
          type="checkbox"
          className="checkbox-input"
          {...register('acceptTerms')}
          disabled={disabled}
        />
        <span className="checkbox-custom" />
        <span className="checkbox-text">
          I agree to the{' '}
          <a
            href="/terms"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </span>
      </label>
      {errors.acceptTerms && (
        <span className="checkbox-error">{errors.acceptTerms.message}</span>
      )}
    </div>
  );
}
