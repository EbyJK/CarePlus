import React, { useState } from 'react';
import { Camera, Sparkles, Check, ChevronRight } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
];

export default function OnboardingModal({ isOpen, user, onComplete }) {
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(user?.avatar || PRESET_AVATARS[0]);
  const [title, setTitle] = useState(user?.title || 'Lead Care Officer');
  const [department, setDepartment] = useState('Cardiology & Intensive Care');
  const [phone, setPhone] = useState(user?.phoneNumber || '+1 (555) 234-5678');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    onComplete({
      ...user,
      avatar,
      title,
      department,
      phoneNumber: phone,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content onboarding-card">
        <div className="onboarding-banner">
          <div className="banner-badge">
            <Sparkles size={14} /> Welcome to CarePulse
          </div>
          <h2>Set Up Your Care Profile</h2>
          <p>Customize your profile photo, job role, and care department to begin managing patient operations.</p>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <h3>1. Choose Your Profile Avatar</h3>
            <p className="step-desc">Upload a photo from your computer or choose from physician presets.</p>
            
            <div className="avatar-preview-section">
              <div className="avatar-circle-with-btn">
                <img src={avatar} alt="Avatar preview" className="avatar-main-img" />
                <label className="upload-badge-pill" title="Upload custom photo">
                  <Camera size={15} />
                  <span>Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                </label>
              </div>
            </div>

            <div className="preset-grid">
              {PRESET_AVATARS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preset ${i + 1}`}
                  className={`preset-thumb ${avatar === url ? 'active' : ''}`}
                  onClick={() => setAvatar(url)}
                />
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                Next: Professional Info <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h3>2. Professional & Contact Details</h3>
            <p className="step-desc">These details will be displayed to your care team members.</p>

            <div className="form-group">
              <label>Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chief Medical Officer, Lead Coordinator"
              />
            </div>

            <div className="form-group">
              <label>Care Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="Cardiology & Intensive Care">Cardiology & Intensive Care</option>
                <option value="Emergency Medicine">Emergency Medicine</option>
                <option value="Pediatrics & Family Medicine">Pediatrics & Family Medicine</option>
                <option value="Surgical Operations">Surgical Operations</option>
                <option value="Health System Operations">Health System Operations</option>
              </select>
            </div>

            <div className="form-group">
              <label>Contact Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-emerald" onClick={handleFinish}>
                <Check size={16} /> Launch CarePulse Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
