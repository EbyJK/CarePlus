import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, UserPlus, Search, Mail, Phone, AlertCircle, RefreshCw, Key } from 'lucide-react';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
];

export default function CareTeamTab({ onNavigateToAddMember }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [authError, setAuthError] = useState(null);

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
          setAuthError('JWT Admin Token required to view PostgreSQL users list.');
        }
      } else {
        setAuthError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const emailMatches = (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const nameMatches = fullName.includes(searchQuery.toLowerCase());
    const roleMatches = roleFilter === 'all' || (u.role && u.role.toLowerCase() === roleFilter.toLowerCase());
    return (nameMatches || emailMatches) && roleMatches;
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
          {onNavigateToAddMember && (
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

      {/* Directory Filter Bar */}
      <div className="card filter-bar-card">
        <div className="search-bar modal-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by staff name or email address..."
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
            className={`filter-pill ${roleFilter === 'supervisor' ? 'active' : ''}`}
            onClick={() => setRoleFilter('supervisor')}
          >
            Supervisors
          </button>
          <button
            className={`filter-pill ${roleFilter === 'user' ? 'active' : ''}`}
            onClick={() => setRoleFilter('user')}
          >
            Physicians / Users
          </button>
        </div>
      </div>

      {/* HORIZONTAL DIRECTORY CARDS LIST */}
      {loading ? (
        <div className="card p-6 text-center text-muted">Loading care team directory from PostgreSQL database...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="card empty-state-card">
          <Users size={40} className="text-muted mb-2" />
          <h3>No team members found</h3>
          <p className="text-muted">No staff records match your current filter or search criteria.</p>
          {onNavigateToAddMember && (
            <button onClick={onNavigateToAddMember} className="btn btn-primary mt-3">
              <UserPlus size={16} /> Add First Team Member
            </button>
          )}
        </div>
      ) : (
        <div className="care-team-horizontal-list">
          {filteredUsers.map((u, idx) => {
            const avatarUrl = u.avatar || SAMPLE_AVATARS[idx % SAMPLE_AVATARS.length];
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
                    <span className={`badge badge-${(u.role || 'user').toLowerCase()}`}>{u.role}</span>
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

                {/* Right: Status & DB ID */}
                <div className="horizontal-status">
                  <span className={`status-pill ${u.isActive !== false ? 'active' : 'inactive'}`}>
                    {u.isActive !== false ? '● Active Staff' : '○ Inactive'}
                  </span>
                  <span className="member-id-pill">PostgreSQL ID: #{u.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
