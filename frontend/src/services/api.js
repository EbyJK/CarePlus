const BASE_URL = '/api';

// Helper for HTTP requests
async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('jwt_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message 
      ? (Array.isArray(data.message) ? data.message.join(', ') : data.message)
      : `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth & User Management Endpoints
  registerUser: (userData) =>
    request('/user-management/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  loginUser: (credentials) =>
    request('/user-management/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/user-management/users${query ? `?${query}` : ''}`);
  },

  createUserAdmin: (userData) =>
    request('/user-management/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  updateUser: (id, userData) =>
    request(`/user-management/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }),

  toggleUserStatus: (id, isActive) =>
    request(`/user-management/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),

  deleteUser: (id) =>
    request(`/user-management/users/${id}`, {
      method: 'DELETE',
    }),

  getUserAuditLogs: (id) =>
    request(`/user-management/users/${id}/audit-logs`),

  // Password Management Endpoints
  changePassword: (data) =>
    request('/user-management/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  requestForgotPasswordOtp: (data) =>
    request('/user-management/auth/forgot-password/otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPasswordWithOtp: (data) =>
    request('/user-management/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Patient & Vitals Management Endpoints
  getPatients: () => request('/patients'),

  createPatient: (patientData) =>
    request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    }),

  reassignPatient: (id, staffId) =>
    request(`/patients/${id}/reassign`, {
      method: 'PATCH',
      body: JSON.stringify({ staffId }),
    }),

  deletePatient: (id) =>
    request(`/patients/${id}`, {
      method: 'DELETE',
    }),

  sendVitalsPdfReport: (id, reportData) =>
    request(`/patients/${id}/send-vitals-report`, {
      method: 'POST',
      body: JSON.stringify(reportData),
    }),

  // SMS Endpoints
  sendSms: (smsData) =>
    request('/sms/send', {
      method: 'POST',
      body: JSON.stringify({
        to: smsData.to || smsData.toPhoneNumber,
        message: smsData.message,
      }),
    }),

  getSmsLogs: () => request('/sms/logs'),

  // Telegram Endpoints
  broadcastTelegram: (messageData) =>
    request('/telegram/broadcast', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),

  sendTelegramPhoto: (photoData) =>
    request('/telegram/send-photo', {
      method: 'POST',
      body: JSON.stringify(photoData),
    }),
};
