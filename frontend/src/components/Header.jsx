import React, { useState } from 'react';
import { HeartPulse, Search, Bell, User, LogOut, Shield, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Header({ currentUser, onOpenGoogleAuth, onOpenProfile, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search care team, patient alerts, or system logs..."
          />
        </div>
      </div>

      <div className="topbar-right">
        {/* Live Status Badge */}
        <div className="system-status-pill">
          <span className="live-pulse"></span>
          <span>CarePulse System Active</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="dropdown-wrapper">
          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Care Alerts & Notifications"
          >
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="dropdown-menu notifications-menu">
              <div className="dropdown-header">
                <strong>Care Notifications</strong>
                <span className="badge badge-emerald">3 New</span>
              </div>
              <div className="notification-item">
                <CheckCircle2 size={16} className="text-emerald" />
                <div>
                  <p>SMS Alert successfully sent to <strong>+1 (415) 555-2671</strong></p>
                  <small>2 mins ago</small>
                </div>
              </div>
              <div className="notification-item">
                <Sparkles size={16} className="text-cyan" />
                <div>
                  <p>Telegram Emergency Channel Broadcast published</p>
                  <small>15 mins ago</small>
                </div>
              </div>
              <div className="notification-item">
                <Shield size={16} className="text-purple" />
                <div>
                  <p>New Physician <strong>Dr. Marcus Vance</strong> added to directory</p>
                  <small>1 hour ago</small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill / Auth Button */}
        {currentUser ? (
          <div className="dropdown-wrapper">
            <div
              className="user-profile-pill"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.firstName}
                className="user-pill-avatar"
              />
              <div className="user-pill-text">
                <span className="user-pill-name">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
                <span className="user-pill-role">
                  {currentUser.title || currentUser.role || 'Care Specialist'}
                </span>
              </div>
              <ChevronDown size={14} className="text-muted" />
            </div>

            {showUserDropdown && (
              <div className="dropdown-menu user-dropdown">
                <div className="user-dropdown-header">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'}
                    alt="avatar"
                  />
                  <div>
                    <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                    <div className="user-email-text">{currentUser.email}</div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenProfile();
                  }}
                >
                  <User size={16} /> Edit Profile & Avatar
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenGoogleAuth();
                  }}
                >
                  <svg className="google-icon-svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg> Switch Google Account
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item text-danger"
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="google-sign-in-btn" onClick={onOpenGoogleAuth}>
            <svg className="google-icon-svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    </header>
  );
}
