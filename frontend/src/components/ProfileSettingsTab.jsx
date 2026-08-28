import React, { useState, useEffect } from 'react';
import { User, Camera, Check, CheckCircle2, AlertCircle } from 'lucide-react';

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

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2><User className="icon-header text-purple" /> User Profile & Avatar Settings</h2>
        <p className="subtitle">Manage your physician avatar photo and personal staff details.</p>
      </div>

      <div className="form-card-container">
        <div className="card">
          <div className="card-header mb-2">
            <User className="card-icon text-purple" />
            <h3>Personal & Medical Staff Info</h3>
          </div>

          <form onSubmit={handleSave}>
            {/* Avatar Section with Camera Badge Moved to Right */}
            <div className="avatar-preview-section mb-4">
              <div className="avatar-circle-with-btn">
                <img src={profileData.avatar} alt="Profile avatar" className="avatar-main-img" />
                <label className="upload-badge-pill" title="Upload custom photo">
                  <Camera size={15} />
                  <span>Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                </label>
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
      </div>
    </div>
  );
}
