'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import AppInput from '@/components/ui/Input/AppInput';
import AppButton from '@/components/ui/Button/AppButton';
import { registerSchema, RegisterFormData } from './registerSchema';
import { PasswordStrength } from './PasswordStrength';
import { Alert } from './Alert';
import { TermsCheckbox } from './TermsCheckbox';
import { LoadingSpinner } from './LoadingSpinner';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import './RegisterForm.css';

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void | Promise<void>;
  onLoginClick?: () => void;
}

function RegisterForm({
  onSubmit: _onSubmit,
  onLoginClick,
}: RegisterFormProps) {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const { createUser, loading, error, isAuthenticated, userInfo } =
    useUserStore();
  const router = useRouter();
  const password = watch('password');

  const handleFormSubmit = async (data: RegisterFormData) => {
    await createUser(data.fullName, data.email, data.password);
    setSubmitSuccess(true);
    router.push('/');
  };

  useEffect(() => {
    if (isAuthenticated && userInfo) {
      setSubmitSuccess(true);
    }
  }, [isAuthenticated, userInfo]);

  return (
    <div className="register-form-container">
      <div className="register-form-card">
        {/* Header */}
        <div className="register-form-header">
          <h1 className="register-form-title">Create Account</h1>
          <p className="register-form-subtitle">
            Join us today and start your journey
          </p>
        </div>

        {/* Alerts */}
        {submitSuccess && (
          <Alert
            type="success"
            message="Registration successful! Welcome aboard!"
          />
        )}
        {error && <Alert type="error" message={error} />}

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="register-form"
        >
          {/* Full Name */}
          <AppInput
            label="Full Name"
            type="text"
            fullWidth
            error={errors.fullName?.message}
            icon={<FiUser size={20} />}
            iconPosition="left"
            disabled={loading}
            {...register('fullName')}
          />

          {/* Email */}
          <AppInput
            label="Email Address"
            type="email"
            fullWidth
            error={errors.email?.message}
            icon={<FiMail size={20} />}
            iconPosition="left"
            disabled={loading}
            {...register('email')}
          />

          {/* Password */}
          <div className="password-field-wrapper">
            <AppInput
              label="Password"
              type="password"
              fullWidth
              error={errors.password?.message}
              showPasswordToggle
              icon={<FiLock size={20} />}
              iconPosition="left"
              disabled={loading}
              {...register('password')}
            />
            <PasswordStrength password={password} />
          </div>

          {/* Confirm Password */}
          <AppInput
            label="Confirm Password"
            type="password"
            fullWidth
            error={errors.confirmPassword?.message}
            showPasswordToggle
            icon={<FiLock size={20} />}
            iconPosition="left"
            disabled={loading}
            {...register('confirmPassword')}
          />

          {/* Terms and Conditions */}
          <TermsCheckbox
            register={register}
            errors={errors}
            disabled={loading}
          />

          {/* Submit Button */}
          <AppButton
            type="submit"
            fullWidth
            size="large"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </AppButton>
        </form>

        {/* Login Link */}
        <div className="form-footer">
          <p className="footer-text">
            Already have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onLoginClick}
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
