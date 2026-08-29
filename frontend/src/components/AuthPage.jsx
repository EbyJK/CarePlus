import React, { useState } from 'react';
import { api } from '../services/api';
import { HeartPulse, Lock, Mail, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Key, UserCheck, HelpCircle, X } from 'lucide-react';

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
    label: 'Admin Account',
    email: 'admin.postgres@example.com',
    password: 'AdminPassword123!',
    role: 'ADMIN',
    badgeClass: 'badge-admin',
    icon: ShieldCheck,
  },
  {
    label: 'Staff Member',
    email: 'user.postgres@example.com',
    password: 'UserPassword123!',
    role: 'STAFF',
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

  // Forgot Password / OTP Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('user.postgres@example.com');
  const [otpStep, setOtpStep] = useState(1); // 1: Request OTP, 2: Enter OTP & New Pass
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [otpStatus, setOtpStatus] = useState(null);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setAuthStatus({ type: 'info', msg: 'Authenticating credentials...' });

    try {
      const res = await api.loginUser(loginData);
      const token = res.data?.accessToken || res.accessToken;
      const user = res.data?.user || res.user || res.data;

      if (!token) {
        throw new Error('Authentication failed: Access token missing in response');
      }

      localStorage.setItem('jwt_token', token);

      const displayRole = (user.role?.toLowerCase() === 'user') ? 'STAFF' : user.role?.toUpperCase();
      setAuthStatus({
        type: 'success',
        msg: `Authentication Successful! Signed in as ${user.email} (${displayRole})`,
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
    setAuthStatus({ type: 'info', msg: 'Registering account...' });

    try {
      await api.registerUser(registerData);
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

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoadingOtp(true);
    setOtpStatus({ type: 'info', msg: 'Generating 6-digit OTP code...' });
    try {
      const res = await api.requestForgotPasswordOtp({ email: forgotEmail });
      const code = res.otpCode || res.data?.otpCode || '849201';
      setGeneratedOtp(code);
      setOtpCodeInput(code); // Pre-fill for convenience
      setOtpStatus({
        type: 'success',
        msg: `OTP Code Generated! Code: ${code}`,
      });
      setOtpStep(2);
    } catch (err) {
      setOtpStatus({ type: 'error', msg: err.message });
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoadingOtp(true);
    setOtpStatus({ type: 'info', msg: 'Resetting account password...' });
    try {
      await api.resetPasswordWithOtp({
        email: forgotEmail,
        otpCode: otpCodeInput,
        newPassword: newPasswordInput,
      });

      setOtpStatus({
        type: 'success',
        msg: 'Password reset successfully! Account unlocked. You can now sign in.',
      });

      setLoginData({
        email: forgotEmail,
        password: newPasswordInput,
      });

      setTimeout(() => {
        setIsForgotModalOpen(false);
        setOtpStatus(null);
      }, 1500);
    } catch (err) {
      setOtpStatus({ type: 'error', msg: err.message });
    } finally {
      setLoadingOtp(false);
    }
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
              <div className="flex-between">
                <label>Password</label>
                <button
                  type="button"
                  className="btn-link-sm text-white font-bold"
                  onClick={() => { setIsForgotModalOpen(true); setOtpStep(1); setOtpStatus(null); }}
                >
                  <HelpCircle size={13} /> Forgot Password? (OTP)
                </button>
              </div>
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
                <span>Authenticating...</span>
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
                  <option value="user">Staff / Physician</option>
                  <option value="admin">Admin / Officer</option>
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
              {loading ? 'Creating Account...' : 'Register Account'}
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
      </div>

      {/* Forgot Password OTP Modal */}
      {isForgotModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsForgotModalOpen(false)}>&times;</button>
            <div className="modal-header-title">
              <Key className="text-cyan" size={24} />
              <div>
                <h3>Reset Account Password (OTP System)</h3>
                <p>Generate a 6-digit security OTP code for verification.</p>
              </div>
            </div>

            {otpStep === 1 ? (
              <form onSubmit={handleRequestOtp}>
                <div className="form-group mb-3">
                  <label>Registered Work Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="user.postgres@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block mb-3" disabled={loadingOtp}>
                  {loadingOtp ? 'Generating OTP...' : 'Request Password Reset OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="form-group mb-3">
                  <label>Generated 6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 849201"
                    value={otpCodeInput}
                    onChange={(e) => setOtpCodeInput(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter new password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-emerald btn-block mb-3" disabled={loadingOtp}>
                  <Key size={16} /> {loadingOtp ? 'Resetting Password...' : 'Reset Password & Unlock Account'}
                </button>
              </form>
            )}

            {otpStatus && (
              <div className={`alert alert-${otpStatus.type} mb-3`}>
                {otpStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <div>
                  <p>{otpStatus.msg}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
