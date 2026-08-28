import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ user, allowedRoles, children, onFallbackRedirect }) {
  // 1. Unauthenticated check
  if (!user) {
    return (
      <div className="auth-page-container">
        <div className="auth-card text-center">
          <ShieldAlert size={48} className="text-danger mx-auto mb-3" />
          <h3>Authentication Required</h3>
          <p className="text-muted text-sm mb-4">Please log in with your credentials to access CarePulse.</p>
          <button className="btn btn-primary" onClick={onFallbackRedirect}>
            Go to Login Screen
          </button>
        </div>
      </div>
    );
  }

  // 2. Role permission check
  const userRole = (user.role || 'user').toLowerCase();
  const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRole);

  if (!isAllowed) {
    return (
      <div className="auth-page-container">
        <div className="auth-card text-center">
          <AlertCircle size={48} className="text-amber mx-auto mb-3" />
          <h2>Access Denied — Admin Privileges Required</h2>
          <p className="text-muted text-sm mb-4">
            Your account (<strong>{user.email}</strong>) has role <span className="badge badge-user">{user.role}</span>.
            This workspace is restricted strictly to <strong>Admin</strong> or <strong>Superadmin</strong> accounts.
          </p>
          <button className="btn btn-primary" onClick={onFallbackRedirect}>
            Return to Staff Portal
          </button>
        </div>
      </div>
    );
  }

  return children;
}
