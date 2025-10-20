'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import './Footer.css';

function Footer() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand & Description */}
          <div className="footer-brand-section">
            <h3 className="footer-brand">Secure Ecommerce</h3>
            <p className="footer-tagline">
              Your trusted destination for quality products at great prices.
            </p>
          </div>

          {/* Social Links */}
          <div className="footer-social">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Twitter"
            >
              <FiTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Instagram"
            >
              <FiInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <button onClick={() => router.push('/')} className="footer-link">
            About
          </button>
          <span className="separator">•</span>
          <button onClick={() => router.push('/')} className="footer-link">
            Contact
          </button>
          <span className="separator">•</span>
          <button onClick={() => router.push('/auth')} className="footer-link">
            Login
          </button>
          <span className="separator">•</span>
          <button onClick={() => router.push('/auth')} className="footer-link">
            Sign Up
          </button>
          <span className="separator">•</span>
          <button onClick={() => router.push('/')} className="footer-link">
            Privacy
          </button>
          <span className="separator">•</span>
          <button onClick={() => router.push('/')} className="footer-link">
            Terms
          </button>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>© {currentYear} Secure Ecommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
