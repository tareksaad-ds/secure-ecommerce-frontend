'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthContainerProps {
  defaultView?: 'login' | 'register';
  onLogin?: (data: any) => void | Promise<void>;
  onRegister?: (data: any) => void | Promise<void>;
  onForgotPassword?: () => void;
}

export default function AuthContainer({
  defaultView = 'login',
  onLogin,
  onRegister,
  onForgotPassword,
}: AuthContainerProps) {
  const [currentView, setCurrentView] = useState<'login' | 'register'>(
    defaultView
  );

  return (
    <>
      {currentView === 'login' ? (
        <LoginForm
          onSubmit={onLogin}
          onRegisterClick={() => setCurrentView('register')}
          onForgotPasswordClick={onForgotPassword}
        />
      ) : (
        <RegisterForm
          onSubmit={onRegister}
          onLoginClick={() => setCurrentView('login')}
        />
      )}
    </>
  );
}
