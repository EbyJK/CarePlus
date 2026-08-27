import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MessageSquare, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function SmsModuleTab() {
  const [smsData, setSmsData] = useState({
    toPhoneNumber: '+14155552671',
    message: 'Hello! This is a test message from our Standalone Modules Dashboard.',
  });

  const [logs, setLogs] = useState([]);
  const [sendResult, setSendResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await api.getSmsLogs();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.log('Failed to fetch SMS logs:', err.message);
    }
  };

  const handleSendSms = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSendResult({ type: 'info', msg: 'Dispatching SMS...' });
    try {
      const res = await api.sendSms(smsData);
      setSendResult({
        type: 'success',
        msg: `SMS Sent successfully! Status: ${res.status || 'SENT'}, Provider: ${res.provider || 'mock'}`,
        data: res,
      });
      fetchLogs();
    } catch (err) {
      setSendResult({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2><MessageSquare className="icon-header text-emerald" /> SMS Dispatch Module</h2>
        <p className="subtitle">Send SMS notifications to mobile numbers and view real-time log records in PostgreSQL (<code>sms_logs</code> table).</p>
      </div>

      <div className="forms-grid">
        {/* Send SMS Form */}
        <div className="card">
          <div className="card-header">
            <Send className="card-icon text-emerald" />
            <h3>Send SMS Message</h3>
          </div>
          <form onSubmit={handleSendSms}>
            <div className="form-group">
              <label>Destination Mobile Phone Number</label>
              <input
                type="text"
                required
                placeholder="+14155552671"
                value={smsData.toPhoneNumber}
                onChange={(e) => setSmsData({ ...smsData, toPhoneNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Message Content</label>
              <textarea
                rows={4}
                required
                placeholder="Type your SMS message here..."
                value={smsData.message}
                onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-emerald" disabled={loading}>
              {loading ? 'Sending...' : 'Send SMS Now'}
            </button>
          </form>

          {sendResult && (
            <div className={`alert alert-${sendResult.type}`}>
              {sendResult.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <div>
                <p>{sendResult.msg}</p>
                {sendResult.data && (
                  <pre className="json-preview">{JSON.stringify(sendResult.data, null, 2)}</pre>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SMS Logs Live View */}
        <div className="card table-card">
          <div className="card-header">
            <h3>SMS Logs History in PostgreSQL (<code>sms_logs</code>)</h3>
            <button onClick={fetchLogs} className="btn btn-sm btn-outline">
              <RefreshCw size={14} /> Refresh Logs
            </button>
          </div>

          {logs.length === 0 ? (
            <p className="empty-text">No SMS logs recorded yet. Send a test SMS to populate rows!</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Provider</th>
                    <th>Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id || log.createdAt}>
                      <td>{log.toPhoneNumber}</td>
                      <td className="msg-cell">{log.message}</td>
                      <td>
                        <span className="badge badge-emerald">
                          {log.status || 'SENT'}
                        </span>
                      </td>
                      <td><code>{log.provider || 'mock'}</code></td>
                      <td>{new Date(log.createdAt || Date.now()).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
