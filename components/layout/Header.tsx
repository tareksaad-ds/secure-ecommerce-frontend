'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import './Header.css';
import { useUserStore } from '@/store/userStore';
import { BiLogOut } from 'react-icons/bi';

interface HeaderProps {
  cartItemsCount?: number;
}

function Header({ cartItemsCount = 0 }: HeaderProps) {
  const router = useRouter();
  const { isAuthenticated, userInfo, logout, validateAuth } = useUserStore();
  useEffect(() => {
    validateAuth?.();
  }, [validateAuth]);
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo & Brand */}
        <div className="header-left">
          <button
            className="logo-button"
            onClick={() => router.push('/')}
            aria-label="Go to home"
          >
            <h1 className="site-title">Secure Ecommerce</h1>
          </button>
          <p className="site-tagline">Your one-stop shop for everything</p>
        </div>

        {/* Actions */}
        <div className="header-right">
          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <div className="auth-buttons">
              <button
                className="auth-button login-button"
                onClick={() => router.push('/auth')}
              >
                <FiUser size={18} />
                <span>Login</span>
              </button>
              <button
                className="auth-button signup-button"
                onClick={() => router.push('/auth')}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div>
              <h3 className="username_header">{userInfo?.name}</h3>
            </div>
          )}
          {isAuthenticated && (
            <button className="logout_button" onClick={() => logout()}>
              <BiLogOut size={24} />
            </button>
          )}
          {/* Cart Button */}
          <button
            className="cart-button"
            onClick={() => router.push('/cart')}
            aria-label="View cart"
          >
            <FiShoppingCart size={24} />
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
