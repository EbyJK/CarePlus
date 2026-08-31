import React, { useState } from 'react';
import { api } from '../services/api';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Smartphone, Sparkles } from 'lucide-react';

const SMS_TEMPLATES = [
  {
    name: 'Twilio Trial Template',
    text: 'Reminder: Appt Tue Oct 29, 3:00 PM. Reply C to confirm or R to reschedule. Test message from Twilio.',
  },
  {
    name: 'Prescription Ready',
    text: 'CarePulse Health: Your prescription #RX-9482 is ready for pickup at the main medical pharmacy.',
  },
  {
    name: 'Emergency Health Alert',
    text: 'CarePulse Urgent: Please review your patient health portal for urgent lab result updates.',
  },
];

export default function SmsModuleTab() {
  const [smsData, setSmsData] = useState({
    to: '+918590651189',
    message: SMS_TEMPLATES[0].text,
  });

  const [sendResult, setSendResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendSms = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSendResult({ type: 'info', msg: 'Dispatching  SMS notification via Twilio Gateway...' });
    try {
      const res = await api.sendSms({
        to: smsData.to,
        message: smsData.message,
      });

      const isSent = res.status === 'SENT' || res.providerMessageId || !res.errorMessage;

      setSendResult({
        type: isSent ? 'success' : 'error',
        msg: isSent
          ? ` SMS Sent Successfully! Provider: ${res.provider?.toUpperCase() || 'TWILIO'} | ID: ${res.providerMessageId || res.id || 'SENT'}`
          : `SMS Dispatch Status: ${res.status || 'FAILED'} — ${res.errorMessage || 'Unknown error'}`,
        data: res,
      });
    } catch (err) {
      setSendResult({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (tpl) => {
    setSmsData((prev) => ({ ...prev, message: tpl.text }));
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2><MessageSquare className="icon-header text-emerald" />  SMS Dispatch Center</h2>
        <p className="subtitle">Dispatch direct SMS patient notifications for prescription pickups and emergency appointments.</p>
      </div>

      <div className="form-card-container">
        <div className="card">
          <div className="card-header mb-2">
            <Send className="card-icon text-emerald" />
            <h3>Compose Patient Notification</h3>
          </div>

          {/* Template Bar */}
          <div className="template-picker mb-3">
            <span className="template-label"><Sparkles size={14} className="text-amber" /> Quick Templates:</span>
            <div className="template-buttons">
              {SMS_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => applyTemplate(tpl)}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendSms}>
            <div className="form-group mb-4">
              <label>Recipient Mobile Phone Number (E.164 International Format)</label>
              <div className="phone-input-wrapper">
                <Smartphone size={18} className="phone-icon" />
                <input
                  type="text"
                  required
                  placeholder="+918590651189"
                  value={smsData.to}
                  onChange={(e) => setSmsData({ ...smsData, to: e.target.value })}
                />
              </div>
              <small className="text-muted text-xs mt-1">
                Twilio Free Trial destination number: <code>+918590651189</code>
              </small>
            </div>

            <div className="form-group mb-4">
              <label>SMS Message Content</label>
              <textarea
                rows={5}
                required
                className="full-textarea"
                placeholder="Type your SMS message..."
                value={smsData.message}
                onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
              ></textarea>
              <small className="char-count">{smsData.message.length} / 160 characters</small>
            </div>

            <button type="submit" className="btn btn-emerald btn-lg" disabled={loading}>
              <Send size={16} /> {loading ? 'Dispatching SMS...' : 'Send SMS Now'}
            </button>
          </form>

          {sendResult && (
            <div className={`alert alert-${sendResult.type} mt-4`}>
              {sendResult.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <div className="alert-content-wrapper">
                <p>{sendResult.msg}</p>
                {sendResult.data && (
                  <pre className="json-preview">{JSON.stringify(sendResult.data, null, 2)}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
