import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Camera, Check, CheckCircle2, AlertCircle, Trash2, Key } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
];

export default function ProfileSettingsTab({ currentUser, onUpdateUser }) {
  const [profileData, setProfileData] = useState({
    firstName: currentUser?.firstName || 'Sarah',
    lastName: currentUser?.lastName || 'Jenkins',
    email: currentUser?.email || 'sarah.jenkins@carepulse.org',
    phoneNumber: currentUser?.phoneNumber || '+1 (415) 555-0199',
    title: currentUser?.title || 'Chief Medical Officer',
    department: currentUser?.department || 'Cardiology & Intensive Care',
    role: currentUser?.role || 'admin',
    avatar: currentUser?.avatar || PRESET_AVATARS[0],
  });

  const [saveStatus, setSaveStatus] = useState(null);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileData((prev) => ({
        ...prev,
        firstName: currentUser.firstName || prev.firstName,
        lastName: currentUser.lastName || prev.lastName,
        email: currentUser.email || prev.email,
        phoneNumber: currentUser.phoneNumber || prev.phoneNumber,
        title: currentUser.title || prev.title,
        department: currentUser.department || prev.department,
        role: currentUser.role || prev.role,
        avatar: currentUser.avatar || prev.avatar,
      }));
    }
  }, [currentUser]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result;
        setProfileData((prev) => ({ ...prev, avatar: newAvatar }));
        if (onUpdateUser) {
          onUpdateUser({ ...currentUser, ...profileData, avatar: newAvatar });
        }
        setSaveStatus({
          type: 'success',
          msg: 'Avatar photo uploaded and updated successfully!',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    if (currentUser?.email) {
      localStorage.removeItem(`carepulse_avatar_${currentUser.email}`);
    }
    const defaultAvatar = PRESET_AVATARS[0];
    setProfileData((prev) => ({ ...prev, avatar: defaultAvatar }));
    if (onUpdateUser) {
      onUpdateUser({ ...currentUser, ...profileData, avatar: defaultAvatar });
    }
    setSaveStatus({
      type: 'success',
      msg: 'Custom avatar photo deleted. Reset to default preset photo.',
    });
  };

  const handleSelectPreset = (url) => {
    setProfileData((prev) => ({ ...prev, avatar: url }));
    if (onUpdateUser) {
      onUpdateUser({ ...currentUser, ...profileData, avatar: url });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveStatus({ type: 'info', msg: 'Saving profile updates...' });
    
    const updatedUser = {
      ...currentUser,
      ...profileData,
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setTimeout(() => {
      setSaveStatus({
        type: 'success',
        msg: 'Profile & Avatar updated successfully!',
      });
    }, 300);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: 'error', msg: 'New password and confirm password do not match.' });
      return;
    }

    setLoadingPass(true);
    setPasswordStatus({ type: 'info', msg: 'Updating account password in PostgreSQL...' });
    try {
      await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordStatus({
        type: 'success',
        msg: 'Account password changed successfully in PostgreSQL!',
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordStatus({ type: 'error', msg: err.message });
    } finally {
      setLoadingPass(false);
    }
  };

  const scrollToPasswordCard = () => {
    const cardEl = document.getElementById('change-password-card');
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-header flex-between">
        <div>
          <h2><User className="icon-header text-purple" /> User Profile & Avatar Settings</h2>
          <p className="subtitle">Manage your physician avatar photo, personal details, and account credentials.</p>
        </div>
        <button
          type="button"
          className="btn btn-purple"
          onClick={scrollToPasswordCard}
          title="Scroll down to change password"
        >
          <Key size={15} />
          <span>Change Password &bull;&gt;</span>
        </button>
      </div>

      <div className="form-card-container">
        {/* Personal Details Card */}
        <div className="card mb-4">
          <div className="card-header mb-2">
            <User className="card-icon text-purple" />
            <h3>Personal & Medical Staff Info</h3>
          </div>

          <form onSubmit={handleSave}>
            {/* Avatar Section with Delete Avatar Option */}
            <div className="avatar-preview-section mb-4">
              <div className="avatar-circle-with-btn">
                <img src={profileData.avatar} alt="Profile avatar" className="avatar-main-img" />
                <div className="flex-align gap-2">
                  <label className="upload-badge-pill" title="Upload custom photo">
                    <Camera size={15} />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                  </label>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm text-danger"
                    onClick={handleRemoveAvatar}
                    title="Delete custom photo"
                  >
                    <Trash2 size={15} /> Delete Avatar
                  </button>
                </div>
              </div>
            </div>

            <div className="preset-grid mb-4">
              {PRESET_AVATARS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preset ${i + 1}`}
                  className={`preset-thumb ${profileData.avatar === url ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(url)}
                />
              ))}
            </div>

            <div className="form-row spacious-row">
              <div className="form-group mb-3">
                <label>First Name</label>
                <input
                  type="text"
                  required
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Last Name</label>
                <input
                  type="text"
                  required
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Work Email Address</label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>

            <div className="form-row spacious-row">
              <div className="form-group mb-3">
                <label>Professional Title</label>
                <input
                  type="text"
                  value={profileData.title}
                  onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Care Department</label>
                <select
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                >
                  <option value="Cardiology & Intensive Care">Cardiology & Intensive Care</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="Pediatrics & Family Medicine">Pediatrics & Family Medicine</option>
                  <option value="Surgical Operations">Surgical Operations</option>
                  <option value="Health System Operations">Health System Operations</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-4">
              <label>Phone Number (for SMS Dispatches)</label>
              <input
                type="text"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-purple btn-lg">
              <Check size={16} /> Save Profile Changes
            </button>

            {saveStatus && (
              <div className={`alert alert-${saveStatus.type} mt-3`}>
                {saveStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{saveStatus.msg}</span>
              </div>
            )}
          </form>
        </div>

        {/* Account Password Change Card */}
        <div className="card" id="change-password-card">
          <div className="card-header mb-2">
            <Key className="card-icon text-cyan" />
            <h3>Change Account Password</h3>
          </div>
          <p className="card-desc">Update your login security credentials in PostgreSQL database.</p>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group mb-3">
              <label>Current Password</label>
              <input
                type="password"
                required
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>

            <div className="form-row spacious-row">
              <div className="form-group mb-3">
                <label>New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-emerald btn-lg" disabled={loadingPass}>
              <Key size={16} /> {loadingPass ? 'Updating Password...' : 'Update Password'}
            </button>

            {passwordStatus && (
              <div className={`alert alert-${passwordStatus.type} mt-3`}>
                {passwordStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{passwordStatus.msg}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
