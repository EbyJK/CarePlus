import React, { useState } from 'react';
import SmsModuleTab from './SmsModuleTab';
import TelegramModuleTab from './TelegramModuleTab';
import ProfileSettingsTab from './ProfileSettingsTab';
import { 
  HeartPulse, 
  User, 
  MessageSquare, 
  Radio, 
  LogOut, 
  Sparkles, 
  Activity, 
  Shield, 
  Send 
} from 'lucide-react';

export default function StaffWorkspace({ user, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="app-layout">
      {/* Clinical Staff Sidebar */}
      <aside className="sidebar staff-sidebar-theme">
        <div className="brand">
          <div className="brand-logo shadow-glow">
            <HeartPulse size={26} />
          </div>
          <div>
            <h1 className="brand-title">CarePulse</h1>
            <span className="brand-badge badge-cyan">CARE PORTAL</span>
          </div>
        </div>

        <nav className="nav-menu">
          <div className="nav-section-title">STAFF WORKSPACE</div>

          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity size={18} />
            <span>Staff Portal Overview</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'sms' ? 'active' : ''}`}
            onClick={() => setActiveTab('sms')}
          >
            <MessageSquare size={18} />
            <span>Patient SMS Alerts</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'telegram' ? 'active' : ''}`}
            onClick={() => setActiveTab('telegram')}
          >
            <Radio size={18} />
            <span>Telegram Channel Bulletins</span>
          </button>

          <div className="nav-section-title">ACCOUNT</div>

          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>My Profile Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="status-live">
            <span className="live-dot"></span> Staff Session Active
          </div>
        </div>
      </aside>

      {/* Main Staff Viewport */}
      <main className="main-content">
        {/* Topbar Header */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="flex-align gap-2">
              <HeartPulse className="text-cyan" size={20} />
              <span className="font-bold">CarePulse Staff Portal</span>
              <span className="badge badge-cyan">{user?.role?.toUpperCase() || 'USER'}</span>
            </div>
          </div>

          <div className="topbar-right">
            <div className="user-profile-pill">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.firstName}
                className="user-pill-avatar"
              />
              <div className="user-pill-text">
                <span className="user-pill-name">{user?.firstName} {user?.lastName}</span>
                <span className="user-pill-role">{user?.email}</span>
              </div>
            </div>

            <button onClick={onLogout} className="btn btn-sm btn-danger">
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="content-body">
          {activeTab === 'overview' && (
            <div className="tab-container">
              {/* Staff Welcome Hero Banner */}
              <div className="overview-hero staff-hero-bg">
                <div className="hero-left">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt="Staff Avatar"
                    className="hero-avatar"
                  />
                  <div>
                    <div className="hero-welcome-badge">
                      <Sparkles size={14} /> Clinical Staff Workspace
                    </div>
                    <h2 className="hero-title">Welcome back, {user?.firstName} {user?.lastName}</h2>
                    <p className="hero-subtitle">
                      Staff Physician &bull; PostgreSQL Authenticated Account
                    </p>
                  </div>
                </div>

                <div className="hero-actions">
                  <button className="btn btn-emerald btn-sm" onClick={() => setActiveTab('sms')}>
                    <MessageSquare size={16} /> Send Patient SMS
                  </button>
                  <button className="btn btn-blue btn-sm" onClick={() => setActiveTab('telegram')}>
                    <Radio size={16} /> View Channel Bulletins
                  </button>
                </div>
              </div>

              {/* Staff Shortcuts Grid - COMPACT MAX-WIDTH CONTAINMENT */}
              <div className="card admin-control-panel-card">
                <div className="card-header">
                  <Shield className="text-cyan" size={22} />
                  <h3>Clinical Quick Actions</h3>
                </div>
                <p className="card-desc">Access clinical dispatch tools, SMS patient alerts, and profile settings.</p>

                <div className="shortcut-cards-grid mt-2">
                  <div className="shortcut-box" onClick={() => setActiveTab('sms')}>
                    <div className="card-header mb-1">
                      <MessageSquare size={18} className="text-emerald" />
                      <h4>Patient SMS Dispatcher</h4>
                    </div>
                    <p className="card-desc">Compose SMS alerts for prescription pickups and appointments.</p>
                    <button className="btn btn-emerald btn-sm mt-3">
                      <Send size={15} /> Compose SMS Alert
                    </button>
                  </div>

                  <div className="shortcut-box" onClick={() => setActiveTab('telegram')}>
                    <div className="card-header mb-1">
                      <Radio size={18} className="text-blue" />
                      <h4>Telegram Channel Alerts</h4>
                    </div>
                    <p className="card-desc">Access formatted channel broadcasts from medical operations.</p>
                    <button className="btn btn-blue btn-sm mt-3">
                      View Telegram Center
                    </button>
                  </div>

                  <div className="shortcut-box" onClick={() => setActiveTab('profile')}>
                    <div className="card-header mb-1">
                      <User size={18} className="text-purple" />
                      <h4>My Profile & Settings</h4>
                    </div>
                    <p className="card-desc">Update your personal details, profile picture, and contacts.</p>
                    <button className="btn btn-purple btn-sm mt-3">
                      Manage Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sms' && <SmsModuleTab />}

          {activeTab === 'telegram' && <TelegramModuleTab />}

          {activeTab === 'profile' && (
            <ProfileSettingsTab
              currentUser={user}
              onUpdateUser={onUpdateUser}
              onOpenGoogleAuth={() => {}}
            />
          )}
        </div>
      </main>
    </div>
  );
}
