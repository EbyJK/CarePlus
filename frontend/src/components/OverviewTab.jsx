import React from 'react';
import {
  Users,
  MessageSquare,
  Radio,
  Activity,
  TrendingUp,
  CheckCircle2,
  Plus,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function OverviewTab({ currentUser, onNavigate, onOpenAddMember, onOpenOnboarding }) {
  const userName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Dr. Sarah Jenkins';
  const userTitle = currentUser?.title || currentUser?.role || 'Lead Care Officer';
  const userDepartment = currentUser?.department || 'Cardiology & Intensive Care';
  const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="tab-container">
      {/* Hero Welcome Header Banner */}
      <div className="overview-hero">
        <div className="hero-left">
          <img src={userAvatar} alt="User Avatar" className="hero-avatar" onClick={onOpenOnboarding} title="Click to customize profile avatar" />
          <div>
            <div className="hero-welcome-badge">
              <Sparkles size={14} /> CarePulse Operations Center
            </div>
            <h2 className="hero-title">Welcome back, {userName}</h2>
            <p className="hero-subtitle">
              {userTitle} &bull; <span className="text-cyan">{userDepartment}</span>
            </p>
          </div>
        </div>

        <div className="hero-actions">
          <button className="btn btn-outline btn-sm" onClick={onOpenAddMember}>
            <Plus size={16} /> Add Staff Member
          </button>
          <button className="btn btn-emerald btn-sm" onClick={() => onNavigate('sms')}>
            <MessageSquare size={16} /> Send SMS Alert
          </button>
          <button className="btn btn-blue btn-sm" onClick={() => onNavigate('telegram')}>
            <Radio size={16} /> Emergency Broadcast
          </button>
        </div>
      </div>

      {/* Profile Onboarding Quick Prompt */}
      {currentUser && !currentUser.hasCompletedOnboarding && (
        <div className="onboarding-prompt-bar">
          <div className="prompt-content">
            <Sparkles className="text-amber" size={20} />
            <div>
              <strong>Complete your CarePulse profile setup</strong>
              <p>Add your avatar image, set your role, and configure notification preferences.</p>
            </div>
          </div>
          <button className="btn btn-warning btn-sm" onClick={onOpenOnboarding}>
            Complete Profile Setup <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onNavigate('team')}>
          <div className="kpi-header">
            <div className="kpi-icon-wrapper icon-cyan">
              <Users size={22} />
            </div>
            <span className="kpi-trend positive">
              <TrendingUp size={14} /> +14.2%
            </span>
          </div>
          <div className="kpi-value">1,428</div>
          <div className="kpi-label">Active Care Members & Staff</div>
          <div className="kpi-footer">42 active shift duty physicians</div>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('sms')}>
          <div className="kpi-header">
            <div className="kpi-icon-wrapper icon-emerald">
              <MessageSquare size={22} />
            </div>
            <span className="kpi-trend positive">
              <TrendingUp size={14} /> 99.6%
            </span>
          </div>
          <div className="kpi-value">892</div>
          <div className="kpi-label"> SMS Alerts Sent</div>
          <div className="kpi-footer">Twilio & Postgres Audit Synced</div>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('telegram')}>
          <div className="kpi-header">
            <div className="kpi-icon-wrapper icon-blue">
              <Radio size={22} />
            </div>
            <span className="kpi-trend neutral">Active</span>
          </div>
          <div className="kpi-value">52</div>
          <div className="kpi-label">Telegram Channel Broadcasts</div>
          <div className="kpi-footer">Emergency channel broadcast status</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper icon-purple">
              <Activity size={22} />
            </div>
            <span className="kpi-trend positive">0.4ms</span>
          </div>
          <div className="kpi-value">100%</div>
          <div className="kpi-label">System Operations Health</div>
          <div className="kpi-footer">PostgreSQL 15.2 Connected</div>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Quick Operations */}
      <div className="overview-main-grid">
        {/* Left Column: Recent Activity Feed */}
        <div className="card">
          <div className="card-header flex-between">
            <div className="flex-align gap-2">
              <Clock className="text-cyan" size={20} />
              <h3>Live Operations Stream</h3>
            </div>
            <span className="badge badge-cyan">Real-time</span>
          </div>

          <div className="activity-stream">
            <div className="activity-item">
              <div className="activity-icon icon-emerald">
                <Send size={16} />
              </div>
              <div className="activity-details">
                <div className="activity-title">
                  SMS Alert Dispatched to Patient <strong>+1 (415) 555-2671</strong>
                </div>
                <div className="activity-meta">
                  <span>Prescription pickup reminder sent</span> &bull; <small>3 mins ago</small>
                </div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon icon-blue">
                <Radio size={16} />
              </div>
              <div className="activity-details">
                <div className="activity-title">
                  Telegram Channel Broadcast <strong>#EmergencyAlert</strong>
                </div>
                <div className="activity-meta">
                  <span>HTML formatted bulletin posted to Telegram</span> &bull; <small>18 mins ago</small>
                </div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon icon-purple">
                <UserCheck size={16} />
              </div>
              <div className="activity-details">
                <div className="activity-title">
                  Google Authenticated User Signed In
                </div>
                <div className="activity-meta">
                  <span>Session verified with JWT access token</span> &bull; <small>1 hour ago</small>
                </div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon icon-cyan">
                <ShieldCheck size={16} />
              </div>
              <div className="activity-details">
                <div className="activity-title">
                  PostgreSQL Audit Log Synced (<code>user_management_accounts</code>)
                </div>
                <div className="activity-meta">
                  <span>Health checks passed</span> &bull; <small>2 hours ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Care System Quick Shortcuts */}
        <div className="card">
          <div className="card-header">
            <Sparkles className="text-amber" size={20} />
            <h3>Care Pulse Modules</h3>
          </div>
          <p className="card-desc">Quick shortcuts to access core operations and communications modules.</p>

          <div className="module-shortcut-list">
            <div className="module-shortcut-card" onClick={() => onNavigate('team')}>
              <div className="shortcut-icon icon-cyan">
                <Users size={20} />
              </div>
              <div className="shortcut-info">
                <strong>Care Team Directory</strong>
                <span>Manage staff credentials, physician roles, and permissions.</span>
              </div>
              <ChevronRight size={18} className="shortcut-arrow" />
            </div>

            <div className="module-shortcut-card" onClick={() => onNavigate('sms')}>
              <div className="shortcut-icon icon-emerald">
                <MessageSquare size={20} />
              </div>
              <div className="shortcut-info">
                <strong> SMS Dispatcher</strong>
                <span>Send SMS alerts & view Postgres delivery log history.</span>
              </div>
              <ChevronRight size={18} className="shortcut-arrow" />
            </div>

            <div className="module-shortcut-card" onClick={() => onNavigate('telegram')}>
              <div className="shortcut-icon icon-blue">
                <Radio size={20} />
              </div>
              <div className="shortcut-info">
                <strong>Telegram Broadcast Center</strong>
                <span>Broadcast emergency alerts and media to channels.</span>
              </div>
              <ChevronRight size={18} className="shortcut-arrow" />
            </div>

            <div className="module-shortcut-card" onClick={() => onNavigate('profile')}>
              <div className="shortcut-icon icon-purple">
                <UserCheck size={20} />
              </div>
              <div className="shortcut-info">
                <strong>Profile & Avatar Settings</strong>
                <span>Update profile photo, job title, and Google account sync.</span>
              </div>
              <ChevronRight size={18} className="shortcut-arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
