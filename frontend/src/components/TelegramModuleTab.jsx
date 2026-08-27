import React, { useState } from 'react';
import { api } from '../services/api';
import { Send, Image, CheckCircle2, AlertCircle, Radio } from 'lucide-react';

export default function TelegramModuleTab() {
  const [textData, setTextData] = useState({
    channelId: '-1003991919897',
    message: '🔥 <b>Announcement</b>: New update published from Standalone Modules Dashboard!',
    parseMode: 'HTML',
  });

  const [photoData, setPhotoData] = useState({
    channelId: '-1003991919897',
    photoUrl: 'https://picsum.photos/800/600',
    caption: '📸 Image Broadcast from Standalone Modules Dashboard',
  });

  const [textStatus, setTextStatus] = useState(null);
  const [photoStatus, setPhotoStatus] = useState(null);
  const [loadingText, setLoadingText] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const handleBroadcastText = async (e) => {
    e.preventDefault();
    setLoadingText(true);
    setTextStatus({ type: 'info', msg: 'Broadcasting text to Telegram channel...' });
    try {
      const res = await api.broadcastTelegram(textData);
      setTextStatus({
        type: 'success',
        msg: 'Telegram Broadcast Sent Successfully!',
        data: res,
      });
    } catch (err) {
      setTextStatus({ type: 'error', msg: err.message });
    } finally {
      setLoadingText(false);
    }
  };

  const handleSendPhoto = async (e) => {
    e.preventDefault();
    setLoadingPhoto(true);
    setPhotoStatus({ type: 'info', msg: 'Sending photo to Telegram channel...' });
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
        <h2><Radio className="icon-header text-blue" /> Telegram Channel Module</h2>
        <p className="subtitle">Broadcast text announcements and media directly to your configured Telegram channel.</p>
      </div>

      <div className="forms-grid">
        {/* Broadcast Text Message */}
        <div className="card">
          <div className="card-header">
            <Send className="card-icon text-blue" />
            <h3>1. Broadcast Channel Text Message</h3>
          </div>
          <form onSubmit={handleBroadcastText}>
            <div className="form-group">
              <label>Telegram Channel ID</label>
              <input
                type="text"
                required
                placeholder="-1003991919897"
                value={textData.channelId}
                onChange={(e) => setTextData({ ...textData, channelId: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Parse Mode</label>
              <select
                value={textData.parseMode}
                onChange={(e) => setTextData({ ...textData, parseMode: e.target.value })}
              >
                <option value="HTML">HTML</option>
                <option value="MarkdownV2">MarkdownV2</option>
                <option value="Markdown">Markdown</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message Content</label>
              <textarea
                rows={4}
                required
                placeholder="Type HTML formatted message..."
                value={textData.message}
                onChange={(e) => setTextData({ ...textData, message: e.target.value })}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-blue" disabled={loadingText}>
              {loadingText ? 'Broadcasting...' : 'Broadcast Text Message'}
            </button>
          </form>

          {textStatus && (
            <div className={`alert alert-${textStatus.type}`}>
              {textStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <div>
                <p>{textStatus.msg}</p>
                {textStatus.data && (
                  <pre className="json-preview">{JSON.stringify(textStatus.data, null, 2)}</pre>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Send Photo Message */}
        <div className="card">
          <div className="card-header">
            <Image className="card-icon text-indigo" />
            <h3>2. Send Photo to Channel</h3>
          </div>
          <form onSubmit={handleSendPhoto}>
            <div className="form-group">
              <label>Telegram Channel ID</label>
              <input
                type="text"
                required
                placeholder="-1003991919897"
                value={photoData.channelId}
                onChange={(e) => setPhotoData({ ...photoData, channelId: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Photo Public URL</label>
              <input
                type="url"
                required
                placeholder="https://example.com/image.jpg"
                value={photoData.photoUrl}
                onChange={(e) => setPhotoData({ ...photoData, photoUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Photo Caption</label>
              <textarea
                rows={3}
                placeholder="Image caption text..."
                value={photoData.caption}
                onChange={(e) => setPhotoData({ ...photoData, caption: e.target.value })}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-indigo" disabled={loadingPhoto}>
              {loadingPhoto ? 'Sending...' : 'Send Photo Broadcast'}
            </button>
          </form>

          {photoStatus && (
            <div className={`alert alert-${photoStatus.type}`}>
              {photoStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <div>
                <p>{photoStatus.msg}</p>
                {photoStatus.data && (
                  <pre className="json-preview">{JSON.stringify(photoStatus.data, null, 2)}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
