import React, { useState } from 'react';
import { Shield, Sparkles, Check, ArrowRight, UserCheck, Key, Mail } from 'lucide-react';

const MOCK_GOOGLE_ACCOUNTS = [
  {
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@carepulse.org',
    role: 'Chief Medical Officer',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Alex Morgan',
    email: 'alex.morgan@carepulse.org',
    role: 'Lead Care Coordinator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@carepulse.org',
    role: 'Staff Physician',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
];

export default function GoogleAuthModal({ isOpen, onClose, onGoogleSuccess }) {
  const [selectedAccount, setSelectedAccount] = useState(MOCK_GOOGLE_ACCOUNTS[0]);
  const [customEmail, setCustomEmail] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccount = (acc) => {
    setSelectedAccount(acc);
    setUseCustom(false);
  };

  const handleProceedGoogle = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      let finalUser;
      if (useCustom && customEmail.trim()) {
        const namePart = customEmail.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        finalUser = {
          email: customEmail.trim(),
          firstName: formattedName,
          lastName: 'User',
          role: 'admin',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customEmail)}`,
          title: 'Care Specialist',
          isGoogleAuth: true,
        };
      } else {
        const parts = selectedAccount.name.split(' ');
        finalUser = {
          email: selectedAccount.email,
          firstName: parts[0] || 'Care',
          lastName: parts.slice(1).join(' ') || 'User',
          role: 'admin',
          avatar: selectedAccount.avatar,
          title: selectedAccount.role,
          isGoogleAuth: true,
        };
      }

      // Generate a mock JWT access token for session
      const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.google.${btoa(finalUser.email)}.${Date.now()}`;
      
      onGoogleSuccess(finalUser, mockJwt);
      setIsSigningIn(false);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content google-auth-card">
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="google-header">
          <svg className="google-icon-svg" viewBox="0 0 24 24" width="32" height="32">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <div>
            <h3>Sign in with Google</h3>
            <p>Choose an account to continue to <strong>CarePulse Health</strong></p>
          </div>
        </div>

        <div className="account-list">
          {MOCK_GOOGLE_ACCOUNTS.map((acc) => {
            const isSelected = !useCustom && selectedAccount.email === acc.email;
            return (
              <div
                key={acc.email}
                className={`account-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectAccount(acc)}
              >
                <img src={acc.avatar} alt={acc.name} className="account-avatar" />
                <div className="account-info">
                  <div className="account-name">{acc.name}</div>
                  <div className="account-email">{acc.email}</div>
                  <div className="account-role">{acc.role}</div>
                </div>
                {isSelected && <Check className="check-icon" size={18} />}
              </div>
            );
          })}

          <div
            className={`account-item ${useCustom ? 'selected' : ''}`}
            onClick={() => setUseCustom(true)}
          >
            <div className="custom-avatar">
              <Mail size={18} />
            </div>
            <div className="account-info" style={{ width: '100%' }}>
              <div className="account-name">Use another Google Account</div>
              {useCustom && (
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="custom-email-input"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose} disabled={isSigningIn}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleProceedGoogle} disabled={isSigningIn}>
            {isSigningIn ? (
              <span>Connecting to Google...</span>
            ) : (
              <>
                <span>Continue to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
