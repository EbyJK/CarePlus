import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserPlus, LogIn, ShieldAlert, Users, CheckCircle2, AlertCircle, Key } from 'lucide-react';

export default function UserManagementTab() {
  // Public Register Form State
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'user',
  });

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Admin Create User Form State
  const [adminCreateData, setAdminCreateData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'admin',
  });

  const [usersList, setUsersList] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user_details') || 'null')
  );

  const [registerStatus, setRegisterStatus] = useState(null);
  const [loginStatus, setLoginStatus] = useState(null);
  const [adminCreateStatus, setAdminCreateStatus] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.getUsers();
      if (res && res.data) {
        setUsersList(res.data);
      }
    } catch (err) {
      console.log('Failed to fetch protected users list:', err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterStatus({ type: 'info', msg: 'Registering user...' });
    try {
      const res = await api.registerUser(registerData);
      setRegisterStatus({
        type: 'success',
        msg: `User registered successfully! ID: #${res.data?.id || ''}`,
      });
      setRegisterData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 'user',
      });
      fetchUsers();
    } catch (err) {
      setRegisterStatus({ type: 'error', msg: err.message });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus({ type: 'info', msg: 'Logging in...' });
    try {
      const res = await api.loginUser(loginData);
      const accessToken = res.data?.accessToken;
      const user = res.data?.user;

      if (accessToken) {
        localStorage.setItem('jwt_token', accessToken);
        localStorage.setItem('user_details', JSON.stringify(user));
        setToken(accessToken);
        setCurrentUser(user);
        setLoginStatus({
          type: 'success',
          msg: `Login successful! Token saved. Logged in as ${user?.email} (${user?.role})`,
        });
      }
    } catch (err) {
      setLoginStatus({ type: 'error', msg: err.message });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_details');
    setToken('');
    setCurrentUser(null);
    setUsersList([]);
    setLoginStatus({ type: 'info', msg: 'Logged out successfully.' });
  };

  const handleAdminCreate = async (e) => {
    e.preventDefault();
    setAdminCreateStatus({ type: 'info', msg: 'Creating user as Admin...' });
    try {
      const res = await api.createUserAdmin(adminCreateData);
      setAdminCreateStatus({
        type: 'success',
        msg: `Admin created user successfully! ID: #${res.data?.id || ''}`,
      });
      setAdminCreateData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 'admin',
      });
      fetchUsers();
    } catch (err) {
      setAdminCreateStatus({ type: 'error', msg: err.message });
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2><Users className="icon-header" /> User Management & Auth Dashboard</h2>
        <p className="subtitle">Create users/admins, authenticate to obtain JWT token, and inspect PostgreSQL database records.</p>
      </div>

      {/* Grid of Forms */}
      <div className="forms-grid">
        {/* Public Register Form */}
        <div className="card">
          <div className="card-header">
            <UserPlus className="card-icon text-cyan" />
            <h3>1. Public User Registration</h3>
          </div>
          <p className="card-desc">Public endpoint (no token required). Creates a record directly in PostgreSQL table <code>user_management_accounts</code>.</p>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                />
              </div>
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
                <label>Role</label>
                <select
                  value={registerData.role}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Register Account</button>
          </form>
          {registerStatus && (
            <div className={`alert alert-${registerStatus.type}`}>
              {registerStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{registerStatus.msg}</span>
            </div>
          )}
        </div>

        {/* Login Form */}
        <div className="card">
          <div className="card-header">
            <LogIn className="card-icon text-amber" />
            <h3>2. User Authentication (Login)</h3>
          </div>
          <p className="card-desc">Authenticates credentials and stores JWT <code>accessToken</code> for protected admin API calls.</p>
          
          {currentUser ? (
            <div className="logged-in-box">
              <div className="user-badge">
                <Key className="text-amber" size={20} />
                <div>
                  <strong>{currentUser.email}</strong>
                  <span className="badge badge-purple">{currentUser.role}</span>
                </div>
              </div>
              <p className="token-preview">Token: {token.substring(0, 28)}...</p>
              <button onClick={handleLogout} className="btn btn-danger">Logout Session</button>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin.postgres@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  placeholder="******"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-warning">Login & Get JWT Token</button>
            </form>
          )}

          {loginStatus && (
            <div className={`alert alert-${loginStatus.type}`}>
              {loginStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{loginStatus.msg}</span>
            </div>
          )}
        </div>

        {/* Protected Admin Create User */}
        <div className="card">
          <div className="card-header">
            <ShieldAlert className="card-icon text-purple" />
            <h3>3. Protected Admin Creation</h3>
          </div>
          <p className="card-desc">Protected endpoint (Requires Admin JWT Token). Allows logged-in Admin to create new users/admins.</p>
          
          {!token ? (
            <div className="alert alert-warning">
              <AlertCircle size={16} />
              <span>Please Login in Section 2 to obtain an Admin JWT Token first.</span>
            </div>
          ) : (
            <form onSubmit={handleAdminCreate}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="newstaff@example.com"
                  value={adminCreateData.email}
                  onChange={(e) => setAdminCreateData({ ...adminCreateData, email: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alice"
                    value={adminCreateData.firstName}
                    onChange={(e) => setAdminCreateData({ ...adminCreateData, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Smith"
                    value={adminCreateData.lastName}
                    onChange={(e) => setAdminCreateData({ ...adminCreateData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="******"
                    value={adminCreateData.password}
                    onChange={(e) => setAdminCreateData({ ...adminCreateData, password: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Assign Role</label>
                  <select
                    value={adminCreateData.role}
                    onChange={(e) => setAdminCreateData({ ...adminCreateData, role: e.target.value })}
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-purple">Create User as Admin</button>
            </form>
          )}

          {adminCreateStatus && (
            <div className={`alert alert-${adminCreateStatus.type}`}>
              {adminCreateStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{adminCreateStatus.msg}</span>
            </div>
          )}
        </div>
      </div>

      {/* PostgreSQL Live Data Table */}
      <div className="card table-card">
        <div className="card-header">
          <h3>Registered Users in PostgreSQL (<code>user_management_accounts</code>)</h3>
          <button onClick={fetchUsers} className="btn btn-sm btn-outline">Refresh Table</button>
        </div>

        {loadingUsers ? (
          <p className="loading-text">Loading user records from PostgreSQL...</p>
        ) : usersList.length === 0 ? (
          <p className="empty-text">No users found or login token required to fetch users list.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                    <td>
                      <span className={`status-pill ${u.isActive ? 'active' : 'inactive'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
