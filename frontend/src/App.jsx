import React, { useState } from 'react';
import UserManagementTab from './components/UserManagementTab';
import SmsModuleTab from './components/SmsModuleTab';
import TelegramModuleTab from './components/TelegramModuleTab';
import { Users, MessageSquare, Radio, Shield, Database, LayoutDashboard } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="brand-title">Standalone Modules</h1>
            <span className="brand-badge">PostgreSQL Powered</span>
          </div>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            <span>User Management</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'sms' ? 'active' : ''}`}
            onClick={() => setActiveTab('sms')}
          >
            <MessageSquare size={18} />
            <span>SMS Module</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'telegram' ? 'active' : ''}`}
            onClick={() => setActiveTab('telegram')}
          >
            <Radio size={18} />
            <span>Telegram Channel</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="db-indicator">
            <Database size={16} className="text-cyan" />
            <span>DB: <code>nest_modules</code> (Postgres)</span>
          </div>
          <div className="status-live">
            <span className="live-dot"></span> Backend API: <code>http://localhost:3000</code>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <Shield className="text-cyan" size={20} />
            <span>Standalone Modules Control Panel</span>
          </div>
          <div className="topbar-right">
            <a
              href="http://localhost:3000/docs"
              target="_blank"
              rel="noreferrer"
              className="swagger-link"
            >
              📚 Open Swagger API Docs
            </a>
          </div>
        </header>

        <div className="content-body">
          {activeTab === 'users' && <UserManagementTab />}
          {activeTab === 'sms' && <SmsModuleTab />}
          {activeTab === 'telegram' && <TelegramModuleTab />}
        </div>
      </main>
    </div>
  );
}
