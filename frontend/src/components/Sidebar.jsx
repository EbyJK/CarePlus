import React from 'react';
import { LayoutDashboard, Users, MessageSquare, Radio, User, Database, HeartPulse, Activity } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div className="brand" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer' }}>
        <div className="brand-logo">
          <HeartPulse size={26} />
        </div>
        <div>
          <h1 className="brand-title">CarePulse</h1>
          <span className="brand-badge">Clinical Dashboard</span>
        </div>
      </div>

      <nav className="nav-menu">
        <div className="nav-section-title">MAIN NAVIGATION</div>

        <button
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard Overview</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users size={18} />
          <span>Care Team & Staff</span>
        </button>

        <div className="nav-section-title">COMMUNICATIONS</div>

        <button
          className={`nav-item ${activeTab === 'sms' ? 'active' : ''}`}
          onClick={() => setActiveTab('sms')}
        >
          <MessageSquare size={18} />
          <span>SMS Alerts</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'telegram' ? 'active' : ''}`}
          onClick={() => setActiveTab('telegram')}
        >
          <Radio size={18} />
          <span>Telegram Broadcasts</span>
        </button>

        <div className="nav-section-title">ACCOUNT & CONFIG</div>

        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          <span>My Profile & Avatar</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="db-indicator">
          <Database size={15} className="text-cyan" />
          <span>PostgreSQL DB: <code>nest_modules_db</code></span>
        </div>
        <div className="status-live">
          <span className="live-dot"></span> Backend API: <code>localhost:3000</code>
        </div>
      </div>
    </aside>
  );
}
