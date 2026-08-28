import React, { useState } from 'react';
import { api } from '../services/api';
import { Radio, Send, Image, CheckCircle2, AlertCircle, Sparkles, Upload } from 'lucide-react';

const BROADCAST_PRESETS = [
  {
    title: 'Emergency Medical Shift Notice',
    html: '🚨 <b>CAREPULSE URGENT ALERT</b>\n\nAll Cardiology on-call physicians please check in with the central ICU desk immediately.',
  },
  {
    title: 'Clinical System Maintenance',
    html: 'ℹ️ <b>CarePulse Maintenance Window</b>\n\nRoutine database updates scheduled for tonight at 02:00 UTC. Systems will remain 99.9% operational.',
  },
];

export default function TelegramModuleTab() {
  const [textData, setTextData] = useState({
    channelId: '-1003991919897',
    message: BROADCAST_PRESETS[0].html,
    parseMode: 'HTML',
  });

  const [photoData, setPhotoData] = useState({
    channelId: '-1003991919897',
    photoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    caption: '🏥 <b>CarePulse Health Facility Bulletin</b>\nNew ICU ward extension opened for emergency cardiology patients.',
  });

  const [activeSubTab, setActiveSubTab] = useState('text');
  const [textStatus, setTextStatus] = useState(null);
  const [photoStatus, setPhotoStatus] = useState(null);
  const [loadingText, setLoadingText] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const handleBroadcastText = async (e) => {
    e.preventDefault();
    setLoadingText(true);
    setTextStatus({ type: 'info', msg: 'Broadcasting alert to Telegram channel...' });
    try {
      const res = await api.broadcastTelegram(textData);
      setTextStatus({
        type: 'success',
        msg: 'Telegram Emergency Channel Broadcast Sent Successfully!',
        data: res,
      });
    } catch (err) {
      setTextStatus({ type: 'error', msg: err.message });
    } finally {
      setLoadingText(false);
    }
  };

  const handleLocalPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoData((prev) => ({ ...prev, photoUrl: reader.result }));
        setPhotoStatus({
          type: 'info',
          msg: `Local image "${file.name}" loaded successfully. Ready to broadcast to Telegram!`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendPhoto = async (e) => {
    e.preventDefault();
    setLoadingPhoto(true);
    setPhotoStatus({ type: 'info', msg: 'Sending photo broadcast to Telegram channel...' });
    try {
      const res = await api.sendTelegramPhoto(photoData);
      setPhotoStatus({
        type: 'success',
        msg: 'Telegram Photo Broadcast Sent Successfully!',
        data: res,
      });
    } catch (err) {
      setPhotoStatus({ type: 'error', msg: err.message });
    } finally {
      setLoadingPhoto(false);
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2><Radio className="icon-header text-blue" /> Telegram Broadcast Center</h2>
        <p className="subtitle">Broadcast formatted emergency notifications and clinical media directly to Telegram channel (Bot API).</p>
      </div>

      <div className="form-card-container">
        <div className="card">
          <div className="card-subtabs mb-3">
            <button
              className={`btn btn-sm ${activeSubTab === 'text' ? 'btn-blue' : 'btn-outline'}`}
              onClick={() => setActiveSubTab('text')}
            >
              <Send size={15} /> Text Announcement
            </button>
            <button
              className={`btn btn-sm ${activeSubTab === 'photo' ? 'btn-blue' : 'btn-outline'}`}
              onClick={() => setActiveSubTab('photo')}
            >
              <Image size={15} /> Photo Broadcast
            </button>
          </div>

          {activeSubTab === 'text' ? (
            <form onSubmit={handleBroadcastText}>
              <div className="form-group mb-3">
                <label>Telegram Channel ID</label>
                <input
                  type="text"
                  required
                  placeholder="-1003991919897"
                  value={textData.channelId}
                  onChange={(e) => setTextData({ ...textData, channelId: e.target.value })}
                />
              </div>

              <div className="template-picker mb-3">
                <span className="template-label"><Sparkles size={14} className="text-amber" /> Presets:</span>
                <div className="template-buttons">
                  {BROADCAST_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setTextData({ ...textData, message: p.html })}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Parse Mode</label>
                <select
                  value={textData.parseMode}
                  onChange={(e) => setTextData({ ...textData, parseMode: e.target.value })}
                >
                  <option value="HTML">HTML (Recommended)</option>
                  <option value="MarkdownV2">MarkdownV2</option>
                  <option value="Markdown">Markdown</option>
                </select>
              </div>

              <div className="form-group mb-4">
                <label>Message Content (HTML Supported)</label>
                <textarea
                  rows={6}
                  required
                  className="full-textarea"
                  placeholder="Type HTML formatted announcement..."
                  value={textData.message}
                  onChange={(e) => setTextData({ ...textData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-blue btn-lg" disabled={loadingText}>
                <Send size={16} /> {loadingText ? 'Broadcasting...' : 'Broadcast Text Announcement'}
              </button>

              {textStatus && (
                <div className={`alert alert-${textStatus.type} mt-4`}>
                  {textStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <div>
                    <p>{textStatus.msg}</p>
                    {textStatus.data && (
                      <pre className="json-preview">{JSON.stringify(textStatus.data, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleSendPhoto}>
              <div className="form-group mb-3">
                <label>Telegram Channel ID</label>
                <input
                  type="text"
                  required
                  placeholder="-1003991919897"
                  value={photoData.channelId}
                  onChange={(e) => setPhotoData({ ...photoData, channelId: e.target.value })}
                />
              </div>

              <div className="form-group mb-3">
                <div className="flex-between">
                  <label>Media Photo URL or Local Computer Image</label>
                  <label className="btn-link-sm text-cyan cursor-pointer">
                    <Upload size={14} /> Upload Local Image File
                    <input type="file" accept="image/*" onChange={handleLocalPhotoUpload} hidden />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... or Base64 Image Data"
                  value={photoData.photoUrl}
                  onChange={(e) => setPhotoData({ ...photoData, photoUrl: e.target.value })}
                />
              </div>

              <div className="form-group mb-4">
                <label>Photo Caption Text</label>
                <textarea
                  rows={4}
                  className="full-textarea"
                  placeholder="Image caption text..."
                  value={photoData.caption}
                  onChange={(e) => setPhotoData({ ...photoData, caption: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-blue btn-lg" disabled={loadingPhoto}>
                <Image size={16} /> {loadingPhoto ? 'Sending Photo...' : 'Broadcast Photo Update'}
              </button>

              {photoStatus && (
                <div className={`alert alert-${photoStatus.type} mt-4`}>
                  {photoStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <div>
                    <p>{photoStatus.msg}</p>
                    {photoStatus.data && (
                      <pre className="json-preview">{JSON.stringify(photoStatus.data, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
