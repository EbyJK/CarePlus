import React, { useState } from 'react';
import { api } from '../services/api';
import { UserCheck, UserPlus, CheckCircle2, AlertCircle, Users } from 'lucide-react';

export default function AddTeamMemberTab({ onNavigateToDirectory }) {
  const [newMember, setNewMember] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'user',
  });

  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ type: 'info', msg: 'Registering new staff member...' });
    try {
      await api.registerUser(newMember);
      
      setSubmitStatus({
        type: 'success',
        msg: `Member ${newMember.firstName} ${newMember.lastName} added successfully!`,
      });

      setNewMember({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 'user',
      });
    } catch (err) {
      setSubmitStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-header flex-between">
        <div>
          <h2><UserPlus className="icon-header text-purple" /> Add Care Team Member</h2>
          <p className="subtitle">Create and provision a new staff account.</p>
        </div>
        {onNavigateToDirectory && (
          <button onClick={onNavigateToDirectory} className="btn btn-outline">
            <Users size={15} /> View Care Team Directory
          </button>
        )}
      </div>

      <div className="form-card-container">
        <div className="card">
          <div className="card-header mb-3">
            <UserCheck className="card-icon text-cyan" size={24} />
            <div>
              <h3>Create Staff Account</h3>
              <p className="card-desc">Enter member information to register their credentials and assign their role.</p>
            </div>
          </div>

          <form onSubmit={handleAddMemberSubmit}>
            <div className="form-row spacious-row">
              <div className="form-group mb-3">
                <label>First Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah"
                  value={newMember.firstName}
                  onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jenkins"
                  value={newMember.lastName}
                  onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Work Email Address</label>
              <input
                type="email"
                required
                placeholder="sarah.jenkins@carepulse.org"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </div>

            <div className="form-row spacious-row">
              <div className="form-group mb-3">
                <label>Account Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>System Role & Permissions</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                >
                  <option value="admin">Admin / Officer (Full Access)</option>
                  <option value="user">Staff / Physician (Clinical Portal)</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-4">
              <label>Mobile Phone Number (for Patient SMS Alerts)</label>
              <input
                type="text"
                placeholder="+14155552671"
                value={newMember.phoneNumber}
                onChange={(e) => setNewMember({ ...newMember, phoneNumber: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-purple btn-lg" disabled={loading}>
              <UserPlus size={16} /> {loading ? 'Creating Account...' : 'Create Staff Member Account'}
            </button>

            {submitStatus && (
              <div className={`alert alert-${submitStatus.type} mt-4 flex-between`}>
                <div className="flex-align gap-2">
                  {submitStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{submitStatus.msg}</span>
                </div>
                {submitStatus.type === 'success' && onNavigateToDirectory && (
                  <button type="button" onClick={onNavigateToDirectory} className="btn btn-sm btn-outline">
                    Go to Directory &bull;&gt;
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
