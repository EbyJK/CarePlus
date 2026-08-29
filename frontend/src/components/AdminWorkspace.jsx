import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CareTeamTab from './CareTeamTab';
import AddTeamMemberTab from './AddTeamMemberTab';
import PatientsModuleTab from './PatientsModuleTab';
import SmsModuleTab from './SmsModuleTab';
import TelegramModuleTab from './TelegramModuleTab';
import ProfileSettingsTab from './ProfileSettingsTab';
import { 
  HeartPulse, 
  Users, 
  Shield, 
  Activity, 
  MessageSquare, 
  Radio, 
  User, 
  LogOut, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  UserPlus
} from 'lucide-react';

export default function AdminWorkspace({ user, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Real Database Counts
  const [dbStats, setDbStats] = useState({
    totalUsers: 0,
    activeStaff: 0,
    totalSmsLogs: 0,
    loading: true,
  });

  useEffect(() => {
    fetchRealDatabaseStats();
  }, []);

  const fetchRealDatabaseStats = async () => {
    setDbStats((prev) => ({ ...prev, loading: true }));
    try {
      const usersRes = await api.getUsers();
      const usersList = Array.isArray(usersRes) ? usersRes : (usersRes?.data || []);
      const activeCount = usersList.filter((u) => u.isActive !== false).length;

      const smsRes = await api.getSmsLogs();
      const smsList = Array.isArray(smsRes) ? smsRes : (smsRes?.data || []);

      setDbStats({
        totalUsers: usersList.length,
        activeStaff: activeCount,
        totalSmsLogs: smsList.length,
        loading: false,
      });
    } catch (err) {
      console.log('Failed to fetch real DB stats:', err.message);
      setDbStats((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="app-layout">
      {/* Dedicated Admin Sidebar */}
      <aside className="sidebar admin-sidebar-theme">
        <div className="brand">
          <div className="brand-logo shadow-glow">
            <HeartPulse size={26} />
          </div>
          <div>
            <h1 className="brand-title">CarePulse</h1>
            <span className="brand-badge badge-purple">ADMIN COMMAND CENTER</span>
          </div>
        </div>

        <nav className="nav-menu">
          <div className="nav-section-title">ADMINISTRATIVE MANAGEMENT</div>

          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity size={18} />
            <span>System Telemetry</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Users size={18} />
            <span>Care Team Directory</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'add-member' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-member')}
          >
            <UserPlus size={18} />
            <span>Add Team Member</span>
          </button>

          <div className="nav-section-title">CLINICAL PATIENT CARE</div>

          <button
            className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <HeartPulse size={18} />
            <span>Hospital Patient Roster</span>
          </button>

          <div className="nav-section-title">SYSTEM DISPATCH & ALERTS</div>

          <button
            className={`nav-item ${activeTab === 'sms' ? 'active' : ''}`}
            onClick={() => setActiveTab('sms')}
          >
            <MessageSquare size={18} />
            <span>Patient SMS Center</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'telegram' ? 'active' : ''}`}
            onClick={() => setActiveTab('telegram')}
          >
            <Radio size={18} />
            <span>Emergency Broadcasts</span>
          </button>

          <div className="nav-section-title">SECURITY & PROFILE</div>

          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Admin Profile Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="status-live">
            <span className="live-dot"></span> Session Active
          </div>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <main className="main-content">
        {/* Topbar Header */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="flex-align gap-2">
              <Shield className="text-purple" size={20} />
              <span className="font-bold">CarePulse Admin Workspace</span>
              <span className="badge badge-purple">
                {user?.role?.toUpperCase() || 'ADMIN'}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            <button onClick={fetchRealDatabaseStats} className="btn btn-sm btn-outline">
              <RefreshCw size={14} /> Refresh DB Stats
            </button>

            <div className="user-profile-pill">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'}
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
              {/* Admin Overview Hero Banner */}
              <div className="overview-hero admin-hero-bg">
                <div className="hero-left">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'}
                    alt="Admin Avatar"
                    className="hero-avatar"
                  />
                  <div>
                    <div className="hero-welcome-badge">
                      <Sparkles size={14} /> System Administrator Portal
                    </div>
                    <h2 className="hero-title">Admin Dashboard — {user?.firstName} {user?.lastName}</h2>
                    <p className="hero-subtitle">
                      Role: <span className="text-purple font-bold">{user?.role?.toUpperCase()}</span>
                    </p>
                  </div>
                </div>

                <div className="hero-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('patients')}>
                    <HeartPulse size={16} /> Patient Roster
                  </button>
                  <button
                    className="btn btn-purple btn-sm"
                    onClick={() => setActiveTab('add-member')}
                  >
                    <UserPlus size={16} /> Add Staff Member
                  </button>
                  <button className="btn btn-emerald btn-sm" onClick={() => setActiveTab('sms')}>
                    <MessageSquare size={16} /> Send SMS Alert
                  </button>
                </div>
              </div>

              {/* REAL DATABASE STATS KPI GRID */}
              <div className="kpi-grid">
                <div className="kpi-card" onClick={() => setActiveTab('team')}>
                  <div className="kpi-header">
                    <div className="kpi-icon-wrapper icon-purple">
                      <Users size={22} />
                    </div>
                    <span className="kpi-trend positive">Total Users</span>
                  </div>
                  <div className="kpi-value">{dbStats.loading ? '...' : dbStats.totalUsers}</div>
                  <div className="kpi-label">Registered Accounts</div>
                </div>

                <div className="kpi-card" onClick={() => setActiveTab('team')}>
                  <div className="kpi-header">
                    <div className="kpi-icon-wrapper icon-emerald">
                      <CheckCircle2 size={22} />
                    </div>
                    <span className="kpi-trend positive">Active</span>
                  </div>
                  <div className="kpi-value">{dbStats.loading ? '...' : dbStats.activeStaff}</div>
                  <div className="kpi-label">Active Staff Members</div>
                </div>

                <div className="kpi-card" onClick={() => setActiveTab('sms')}>
                  <div className="kpi-header">
                    <div className="kpi-icon-wrapper icon-cyan">
                      <MessageSquare size={22} />
                    </div>
                    <span className="kpi-trend neutral">SMS History</span>
                  </div>
                  <div className="kpi-value">{dbStats.loading ? '...' : dbStats.totalSmsLogs}</div>
                  <div className="kpi-label">Total SMS Log Records</div>
                </div>

                <div className="kpi-card" onClick={() => setActiveTab('patients')}>
                  <div className="kpi-header">
                    <div className="kpi-icon-wrapper icon-blue">
                      <HeartPulse size={22} />
                    </div>
                    <span className="kpi-trend positive">Clinical</span>
                  </div>
                  <div className="kpi-value">Live</div>
                  <div className="kpi-label">Patient Vitals Engine</div>
                </div>
              </div>

              {/* Admin Quick Action Shortcuts - COMPACT MAX-WIDTH CONTAINMENT */}
              <div className="card admin-control-panel-card">
                <div className="card-header">
                  <Shield className="text-purple" size={22} />
                  <h3>Administrative Control Panel</h3>
                </div>
                <p className="card-desc">Execute system management tasks, manage hospital patients, and dispatch emergency alerts.</p>

                <div className="shortcut-cards-grid mt-2">
                  <div className="shortcut-box" onClick={() => setActiveTab('patients')}>
                    <div className="card-header mb-1">
                      <HeartPulse size={18} className="text-cyan" />
                      <h4>Hospital Patient Roster</h4>
                    </div>
                    <p className="card-desc">Monitor hospital patients and re-assign doctors.</p>
                    <button className="btn btn-primary btn-sm mt-3">View Patients &bull;&gt;</button>
                  </div>

                  <div className="shortcut-box" onClick={() => setActiveTab('team')}>
                    <div className="card-header mb-1">
                      <Users size={18} className="text-purple" />
                      <h4>Care Team Directory</h4>
                    </div>
                    <p className="card-desc">Manage staff user profiles, change roles, or toggle account status.</p>
                    <button className="btn btn-purple btn-sm mt-3">Manage Directory &bull;&gt;</button>
                  </div>

                  <div className="shortcut-box" onClick={() => setActiveTab('sms')}>
                    <div className="card-header mb-1">
                      <MessageSquare size={18} className="text-emerald" />
                      <h4>Patient SMS Dispatcher</h4>
                    </div>
                    <p className="card-desc">Send immediate SMS alerts to patients and review logs.</p>
                    <button className="btn btn-emerald btn-sm mt-3">Open SMS Center &bull;&gt;</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <PatientsModuleTab currentUser={user} isAdmin={true} />
          )}

          {activeTab === 'team' && (
            <CareTeamTab
              onNavigateToAddMember={() => setActiveTab('add-member')}
            />
          )}

          {activeTab === 'add-member' && (
            <AddTeamMemberTab
              onNavigateToDirectory={() => setActiveTab('team')}
            />
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
