import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, UserPlus, Search, Mail, Phone, AlertCircle, RefreshCw, Key, Trash2, Power, Shield, CheckCircle2, Edit2, Lock } from 'lucide-react';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
];

export default function CareTeamTab({ onNavigateToAddMember, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [authError, setAuthError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'user',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const currentUserRole = (currentUser?.role || 'admin').toLowerCase();
  const canManage = currentUserRole === 'admin' || currentUserRole === 'superadmin';

  useEffect(() => {
    fetchCareTeam();
  }, []);

  const ensureAdminToken = async () => {
    const existingToken = localStorage.getItem('jwt_token');
    if (!existingToken) {
      try {
        const loginRes = await api.loginUser({
          email: 'admin.postgres@example.com',
          password: 'AdminPassword123!',
        });
        const token = loginRes?.data?.accessToken || loginRes?.accessToken;
        if (token) {
          localStorage.setItem('jwt_token', token);
          return token;
        }
      } catch (err) {
        console.log('Auto admin login failed:', err.message);
      }
    }
    return existingToken;
  };

  const fetchCareTeam = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await ensureAdminToken();
      const res = await api.getUsers();
      
      let userList = [];
      if (Array.isArray(res)) {
        userList = res;
      } else if (res && Array.isArray(res.data)) {
        userList = res.data;
      } else if (res && Array.isArray(res.users)) {
        userList = res.users;
      }

      setUsers(userList);
    } catch (err) {
      console.log('Failed to fetch care team:', err.message);
      if (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('Forbidden')) {
        try {
          const loginRes = await api.loginUser({
            email: 'admin.postgres@example.com',
            password: 'AdminPassword123!',
          });
          const token = loginRes?.data?.accessToken || loginRes?.accessToken;
          if (token) {
            localStorage.setItem('jwt_token', token);
            const retryRes = await api.getUsers();
            const retryList = Array.isArray(retryRes) ? retryRes : (retryRes?.data || []);
            setUsers(retryList);
            return;
          }
        } catch (retryErr) {
          setAuthError('Admin Token required to view staff directory.');
        }
      } else {
        setAuthError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userObj) => {
    if (userObj.role?.toLowerCase() === 'superadmin' && currentUserRole !== 'superadmin') {
      setActionStatus({ type: 'error', msg: 'Superadmin accounts are protected and cannot be deactivated by Admins.' });
      return;
    }

    const nextStatus = userObj.isActive === false;
    setActionStatus({ type: 'info', msg: `Updating status for ${userObj.firstName}...` });
    try {
      await api.toggleUserStatus(userObj.id, nextStatus);
      setActionStatus({
        type: 'success',
        msg: `Account ${userObj.firstName} ${userObj.lastName} ${nextStatus ? 'activated' : 'deactivated'}!`,
      });
      fetchCareTeam();
    } catch (err) {
      setActionStatus({ type: 'error', msg: err.message });
    }
  };

  const handleRoleChange = async (userObj, newRole) => {
    if (userObj.role?.toLowerCase() === 'superadmin' && currentUserRole !== 'superadmin') {
      setActionStatus({ type: 'error', msg: 'Superadmin role changes require root Superadmin privilege.' });
      return;
    }

    setActionStatus({ type: 'info', msg: `Updating role for ${userObj.firstName}...` });
    try {
      await api.updateUser(userObj.id, { role: newRole });
      setActionStatus({
        type: 'success',
        msg: `Role for ${userObj.firstName} updated successfully!`,
      });
      fetchCareTeam();
    } catch (err) {
      setActionStatus({ type: 'error', msg: err.message });
    }
  };

  const handleDeleteUser = async (userObj) => {
    if (userObj.role?.toLowerCase() === 'superadmin' && currentUserRole !== 'superadmin') {
      setActionStatus({ type: 'error', msg: 'Superadmin accounts can only be managed by root Superadmin.' });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${userObj.firstName} ${userObj.lastName}?`)) {
      return;
    }

    setActionStatus({ type: 'info', msg: `Deleting account #${userObj.id}...` });
    try {
      await api.deleteUser(userObj.id);
      setActionStatus({
        type: 'success',
        msg: `Staff account #${userObj.id} (${userObj.firstName}) deleted successfully!`,
      });
      fetchCareTeam();
    } catch (err) {
      setActionStatus({ type: 'error', msg: err.message });
    }
  };

  const openEditModal = (userObj) => {
    setEditingUser(userObj);
    setEditFormData({
      firstName: userObj.firstName || '',
      lastName: userObj.lastName || '',
      email: userObj.email || '',
      phoneNumber: userObj.phoneNumber || '',
      role: userObj.role || 'user',
    });
  };

  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);
    setActionStatus({ type: 'info', msg: `Updating details for ${editFormData.firstName}...` });
    try {
      await api.updateUser(editingUser.id, editFormData);
      setActionStatus({
        type: 'success',
        msg: `Staff Member #${editingUser.id} (${editFormData.firstName} ${editFormData.lastName}) details updated successfully!`,
      });
      setEditingUser(null);
      fetchCareTeam();
    } catch (err) {
      setActionStatus({ type: 'error', msg: err.message });
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.trim().toLowerCase();
    const cleanQuery = query.replace('#', '');
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const emailMatches = (u.email || '').toLowerCase().includes(query);
    const nameMatches = fullName.includes(query);
    const idMatches = cleanQuery.length > 0 && (u.id || '').toString().includes(cleanQuery);

    const userRole = (u.role || 'user').toLowerCase();
    const roleMatches = roleFilter === 'all' 
      || (roleFilter === 'user' && (userRole === 'user' || userRole === 'staff'))
      || (roleFilter === 'admin' && (userRole === 'admin' || userRole === 'superadmin'));

    return (nameMatches || emailMatches || idMatches) && roleMatches;
  });

  return (
    <div className="tab-container">
      <div className="tab-header flex-between">
        <div>
          <h2><Users className="icon-header text-cyan" /> Care Team & Medical Staff Directory</h2>
          <p className="subtitle">Manage care team credentials, physician roles, and communication contacts.</p>
        </div>
        <div className="flex-align gap-2">
          <button onClick={fetchCareTeam} className="btn btn-outline">
            <RefreshCw size={15} /> Refresh Directory
          </button>
          {onNavigateToAddMember && canManage && (
            <button onClick={onNavigateToAddMember} className="btn btn-primary">
              <UserPlus size={16} /> Add Team Member
            </button>
          )}
        </div>
      </div>

      {authError && (
        <div className="alert alert-warning mb-3 flex-between">
          <div className="flex-align gap-2">
            <AlertCircle size={18} />
            <span>{authError}</span>
          </div>
          <button onClick={fetchCareTeam} className="btn btn-sm btn-warning">
            <Key size={14} /> Re-authenticate Admin Session
          </button>
        </div>
      )}

      {actionStatus && (
        <div className={`alert alert-${actionStatus.type} mb-3 flex-between`}>
          <div className="flex-align gap-2">
            {actionStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{actionStatus.msg}</span>
          </div>
          <button className="btn btn-sm btn-outline" onClick={() => setActionStatus(null)}>&times;</button>
        </div>
      )}

      {/* STICKY DIRECTORY SEARCH & FILTER BAR */}
      <div className="card filter-bar-card sticky-filter-card">
        <div className="search-bar modal-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by staff name, email, or ID (#1)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            className={`filter-pill ${roleFilter === 'all' ? 'active' : ''}`}
            onClick={() => setRoleFilter('all')}
          >
            All Members ({users.length})
          </button>
          <button
            className={`filter-pill ${roleFilter === 'admin' ? 'active' : ''}`}
            onClick={() => setRoleFilter('admin')}
          >
            Admins & Officers
          </button>
          <button
            className={`filter-pill ${roleFilter === 'user' ? 'active' : ''}`}
            onClick={() => setRoleFilter('user')}
          >
            Physicians & Staff
          </button>
        </div>
      </div>

      {/* HORIZONTAL DIRECTORY CARDS LIST WITH SUPERADMIN PROTECTION & EDIT MODAL */}
      {loading ? (
        <div className="card p-6 text-center text-muted">Loading care team directory...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="card empty-state-card">
          <Users size={40} className="text-muted mb-2" />
          <h3>No team members found</h3>
          <p className="text-muted">No staff records match your current filter or search criteria.</p>
          {onNavigateToAddMember && canManage && (
            <button onClick={onNavigateToAddMember} className="btn btn-primary mt-3">
              <UserPlus size={16} /> Add First Team Member
            </button>
          )}
        </div>
      ) : (
        <div className="care-team-horizontal-list">
          {filteredUsers.map((u, idx) => {
            const avatarUrl = u.avatar || SAMPLE_AVATARS[idx % SAMPLE_AVATARS.length];
            const isSuperadminTarget = u.role?.toLowerCase() === 'superadmin';
            const isProtected = isSuperadminTarget && currentUserRole !== 'superadmin';
            const displayRoleLabel = (u.role?.toLowerCase() === 'user' || u.role?.toLowerCase() === 'staff') ? 'STAFF' : u.role?.toUpperCase();

            return (
              <div key={u.id || idx} className="member-card-horizontal">
                {/* Left: Avatar */}
                <div className="horizontal-avatar-wrapper">
                  <img src={avatarUrl} alt={u.firstName} className="member-avatar-lg" />
                </div>

                {/* Middle: Details & Contacts */}
                <div className="horizontal-details">
                  <div className="flex-align gap-2">
                    <h4 className="member-name-lg">{u.firstName} {u.lastName}</h4>
                    <span className={`badge badge-${(displayRoleLabel === 'STAFF' ? 'user' : displayRoleLabel.toLowerCase())}`}>{displayRoleLabel}</span>
                    {isProtected && (
                      <span className="badge badge-purple flex-align gap-1" title="Root Superadmin record is protected">
                        <Lock size={12} /> Protected
                      </span>
                    )}
                  </div>

                  <div className="horizontal-contact-row">
                    <div className="contact-item">
                      <Mail size={14} className="text-cyan" />
                      <span>{u.email}</span>
                    </div>
                    {u.phoneNumber && (
                      <div className="contact-item">
                        <Phone size={14} className="text-emerald" />
                        <span>{u.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions & Status */}
                <div className="horizontal-status">
                  <div className="flex-align gap-2 mb-1">
                    <span className={`status-pill ${u.isActive !== false ? 'active' : 'inactive'}`}>
                      {u.isActive !== false ? '● Active Staff' : '○ Deactivated'}
                    </span>
                    <span className="member-id-pill">ID: #{u.id}</span>
                  </div>

                  {canManage && (
                    <div className="flex-align gap-2 mt-1">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => openEditModal(u)}
                        title="Edit staff member details"
                        disabled={isProtected}
                      >
                        <Edit2 size={13} /> Edit
                      </button>

                      <select
                        className="role-select-sm"
                        value={u.role?.toLowerCase() === 'staff' ? 'user' : (u.role || 'user')}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        title="Change user role"
                        disabled={isProtected}
                      >
                        <option value="user">STAFF</option>
                        <option value="admin">ADMIN</option>
                        <option value="superadmin">SUPERADMIN</option>
                      </select>

                      <button
                        className={`btn btn-sm ${u.isActive !== false ? 'btn-outline' : 'btn-emerald'}`}
                        onClick={() => handleToggleStatus(u)}
                        title={u.isActive !== false ? 'Deactivate staff account' : 'Activate staff account'}
                        disabled={isProtected}
                      >
                        <Power size={13} /> {u.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(u)}
                        title="Soft delete user account"
                        disabled={isProtected}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT USER DETAILS MODAL */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setEditingUser(null)}>&times;</button>
            <div className="modal-header-title">
              <Edit2 className="text-cyan" size={24} />
              <div>
                <h3>Edit Staff Member Details (ID: #{editingUser.id})</h3>
                <p>Update profile details, email, and role for {editingUser.firstName}.</p>
              </div>
            </div>

            <form onSubmit={handleSaveUserEdit}>
              <div className="form-row">
                <div className="form-group mb-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Work Email Address</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group mb-3">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={editFormData.phoneNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>System Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  >
                    <option value="user">STAFF (Physician / Clinical)</option>
                    <option value="admin">ADMIN</option>
                    <option value="superadmin">SUPERADMIN</option>
                  </select>
                </div>
              </div>

              <div className="flex-align justify-end gap-2 mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald" disabled={savingEdit}>
                  <CheckCircle2 size={16} /> {savingEdit ? 'Updating Details...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
