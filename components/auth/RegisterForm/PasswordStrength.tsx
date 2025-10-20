import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

const getPasswordStrength = (pwd: string): number => {
  if (!pwd) return 0;
  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (pwd.length >= 12) strength++;
  if (/[a-z]/.test(pwd)) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[^A-Za-z0-9]/.test(pwd)) strength++;
  return Math.min(strength, 5);
};

const strengthConfig = [
  { label: '', color: '' },
  { label: 'Very Weak', color: '#eb3852' },
  { label: 'Weak', color: '#ff9800' },
  { label: 'Fair', color: '#ffc107' },
  { label: 'Good', color: '#4caf50' },
  { label: 'Strong', color: '#06d6a0' },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);
  const { label, color } = strengthConfig[strength];

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="password-strength-bars">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`strength-bar ${level <= strength ? 'active' : ''}`}
            style={{
              backgroundColor: level <= strength ? color : undefined,
            }}
          />
        ))}
      </div>
      <span className="password-strength-label" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
