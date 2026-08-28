import React, { useState } from 'react';
import { api } from '../services/api';
import { HeartPulse, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Key, UserCheck } from 'lucide-react';

const DEMO_CREDENTIALS = [
  {
    label: 'Superadmin',
    email: 'superadmin.postgres@example.com',
    password: 'SuperPassword123!',
    role: 'SUPERADMIN',
    badgeClass: 'badge-purple',
    icon: Sparkles,
  },
  {
    label: 'Postgres Admin',
    email: 'admin.postgres@example.com',
    password: 'AdminPassword123!',
    role: 'ADMIN',
    badgeClass: 'badge-admin',
    icon: ShieldCheck,
  },
  {
    label: 'Postgres User',
    email: 'user.postgres@example.com',
    password: 'UserPassword123!',
    role: 'USER',
    badgeClass: 'badge-user',
    icon: UserCheck,
  },
];

export default function AuthPage({ onLoginSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginData, setLoginData] = useState({
    email: 'admin.postgres@example.com',
    password: 'AdminPassword123!',
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'user',
  });

  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setAuthStatus({ type: 'info', msg: 'Authenticating credentials with NestJS PostgreSQL backend...' });

    try {
      const res = await api.loginUser(loginData);
      const token = res.data?.accessToken || res.accessToken;
      const user = res.data?.user || res.user || res.data;

      if (!token) {
        throw new Error('Authentication failed: Access token missing in response');
      }

      localStorage.setItem('jwt_token', token);

      setAuthStatus({
        type: 'success',
        msg: `Authentication Successful! Signed in as ${user.email} (${user.role?.toUpperCase()})`,
      });

      setTimeout(() => {
        onLoginSuccess(user, token);
      }, 600);
    } catch (err) {
      setAuthStatus({ type: 'error', msg: err.message || 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthStatus({ type: 'info', msg: 'Registering account in PostgreSQL database...' });

    try {
      const res = await api.registerUser(registerData);
      setAuthStatus({
        type: 'success',
        msg: `Account registered successfully! Please log in with your credentials.`,
      });

      setLoginData({
        email: registerData.email,
        password: registerData.password,
      });

      setIsRegisterMode(false);
    } catch (err) {
      setAuthStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demo) => {
    setLoginData({
      email: demo.email,
      password: demo.password,
    });
    setAuthStatus({
      type: 'info',
      msg: `Loaded ${demo.label} credentials. Click "Sign In to CarePulse" to authenticate.`,
    });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="brand-logo shadow-glow">
            <HeartPulse size={30} />
          </div>
          <h2>CarePulse Health</h2>
          <p className="auth-subtitle">Enterprise Clinical & Care Management Operations System</p>
        </div>

        {/* Quick Demo Credentials Shortcuts */}
        <div className="demo-shortcuts-bar">
          <div className="shortcuts-label">
            <Sparkles size={14} className="text-amber" /> 1-Click Demo Credentials:
          </div>
          <div className="shortcuts-pills">
            {DEMO_CREDENTIALS.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.email}
                  type="button"
                  className="shortcut-pill-btn"
                  onClick={() => fillDemoAccount(demo)}
                >
                  <Icon size={14} />
                  <span>{demo.label}</span>
                  <span className={`badge ${demo.badgeClass}`}>{demo.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="auth-subtabs">
          <button
            className={`auth-subtab-btn ${!isRegisterMode ? 'active' : ''}`}
            onClick={() => { setIsRegisterMode(false); setAuthStatus(null); }}
          >
            <Lock size={15} /> Sign In
          </button>
          <button
            className={`auth-subtab-btn ${isRegisterMode ? 'active' : ''}`}
            onClick={() => { setIsRegisterMode(true); setAuthStatus(null); }}
          >
            <UserCheck size={15} /> Create Staff Account
          </button>
        </div>

        {/* Form Section */}
        {!isRegisterMode ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Work Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="admin.postgres@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  required
                  placeholder="******"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-2" disabled={loading}>
              {loading ? (
                <span>Authenticating with NestJS...</span>
              ) : (
                <>
                  <span>Sign In to CarePulse</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Sarah"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jenkins"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Work Email Address</label>
              <input
                type="email"
                required
                placeholder="sarah.jenkins@hospital.org"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="******"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Requested Role</label>
                <select
                  value={registerData.role}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                >
                  <option value="user">User / Physician</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Phone Number</label>
              <input
                type="text"
                placeholder="+14155552671"
                value={registerData.phoneNumber}
                onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-emerald btn-block mt-2" disabled={loading}>
              {loading ? 'Creating Account in PostgreSQL...' : 'Register Account'}
            </button>
          </form>
        )}

        {/* Status Alerts */}
        {authStatus && (
          <div className={`alert alert-${authStatus.type} mt-3`}>
            {authStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{authStatus.msg}</span>
          </div>
        )}

        <div className="auth-footer-note">
          <span>Protected by NestJS JWT Strategy & PostgreSQL Database &bull; Port 3000</span>
        </div>
      </div>
    </div>
  );
}
