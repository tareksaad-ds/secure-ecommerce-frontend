'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiMail, FiLock } from 'react-icons/fi';
import AppInput from '@/components/ui/Input/AppInput';
import AppButton from '@/components/ui/Button/AppButton';
import { loginSchema, LoginFormData } from './loginSchema';
import { Alert } from '../RegisterForm/Alert';
import { LoadingSpinner } from '../RegisterForm/LoadingSpinner';
import { RememberMeCheckbox } from './RememberMeCheckbox';
import './LoginForm.css';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
  onRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
}

function LoginForm({
  onSubmit: _onSubmit,
  onRegisterClick,
  onForgotPasswordClick,
}: LoginFormProps) {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });
  const { login, userInfo, loading, error, isAuthenticated } = useUserStore();
  const router = useRouter();
  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      setSubmitSuccess(true);
      router.push('/');
    } catch (_) {
      // error already handled in store
    }
  };

  useEffect(() => {
    if (isAuthenticated && userInfo) {
      setSubmitSuccess(true);
    }
  }, [isAuthenticated, userInfo]);

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        {/* Header */}
        <div className="login-form-header">
          <h1 className="login-form-title">Welcome Back</h1>
          <p className="login-form-subtitle">Sign in to your account</p>
        </div>

        {/* Alerts */}
        {submitSuccess && (
          <Alert type="success" message="Login successful! Redirecting..." />
        )}
        {error && <Alert type="error" message={error} />}

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="login-form">
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

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <RememberMeCheckbox register={register} disabled={loading} />
            <button
              type="button"
              className="forgot-password-link"
              onClick={onForgotPasswordClick}
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>

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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </AppButton>
        </form>

        {/* Divider */}
        <div className="divider">
          <span className="divider-line" />
          <span className="divider-text">OR</span>
          <span className="divider-line" />
        </div>

        {/* Register Link */}
        <div className="form-footer">
          <p className="footer-text">
            Dont have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onRegisterClick}
              disabled={loading}
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
