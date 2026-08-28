import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import AdminWorkspace from './components/AdminWorkspace';
import StaffWorkspace from './components/StaffWorkspace';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('carepulse_auth_user');
    const token = localStorage.getItem('jwt_token');
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.email) {
          const storedAvatar = localStorage.getItem(`carepulse_avatar_${parsed.email}`);
          if (storedAvatar) {
            parsed.avatar = storedAvatar;
          }
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      if (currentUser.email && currentUser.avatar) {
        localStorage.setItem(`carepulse_avatar_${currentUser.email}`, currentUser.avatar);
      }
      localStorage.setItem('carepulse_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('carepulse_auth_user');
      localStorage.removeItem('jwt_token');
    }
  }, [currentUser]);

  const handleLoginSuccess = (user, token) => {
    localStorage.setItem('jwt_token', token);
    const userEmail = user?.email;
    const storedAvatar = userEmail ? localStorage.getItem(`carepulse_avatar_${userEmail}`) : null;
    const userWithAvatar = {
      ...user,
      avatar: storedAvatar || user.avatar,
    };
    setCurrentUser(userWithAvatar);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser((prev) => {
      const nextUser = { ...prev, ...updatedUser };
      if (nextUser.email && nextUser.avatar) {
        localStorage.setItem(`carepulse_avatar_${nextUser.email}`, nextUser.avatar);
      }
      localStorage.setItem('carepulse_auth_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('carepulse_auth_user');
    setCurrentUser(null);
  };

  // If unauthenticated: Render Production Auth Screen
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Evaluate verified role from backend JWT session
  const userRole = (currentUser.role || 'user').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  // AUTOMATIC REDIRECTION TO DEDICATED ROLE WORKSPACES
  if (isAdmin) {
    return (
      <ProtectedRoute
        user={currentUser}
        allowedRoles={['admin', 'superadmin']}
        onFallbackRedirect={handleLogout}
      >
        <AdminWorkspace
          user={currentUser}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      </ProtectedRoute>
    );
  }

  // Standard User / Staff Portal Workspace
  return (
    <ProtectedRoute
      user={currentUser}
      allowedRoles={['user', 'supervisor']}
      onFallbackRedirect={handleLogout}
    >
      <StaffWorkspace
        user={currentUser}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
      />
    </ProtectedRoute>
  );
}
