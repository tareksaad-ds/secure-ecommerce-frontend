'use client';

import { useRouter } from 'next/navigation';
import AuthContainer from '@/components/auth/AuthContainer';

export default function AuthPage() {
  const router = useRouter();

  const handleLogin = async (data: any) => {
    console.log('Login data:', data);
  };

  const handleRegister = async (data: any) => {
    console.log('Registration data:', data);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <AuthContainer
      defaultView="login"
      onLogin={handleLogin}
      onRegister={handleRegister}
      onForgotPassword={handleForgotPassword}
    />
  );
}
