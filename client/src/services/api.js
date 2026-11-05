// Flexible API base resolution for local dev & Vercel production deployment
const getApiBaseUrl = () => {
  const envUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api';

  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE = getApiBaseUrl();

// Helper for standard JSON fetch with Bearer token
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('swachh_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth & User Management
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  registerCitizen: (data) => request('/auth/register-citizen', { method: 'POST', body: JSON.stringify(data) }),
  createLead: (data) => request('/auth/create-lead', { method: 'POST', body: JSON.stringify(data) }),
  createWorker: (data) => request('/auth/create-worker', { method: 'POST', body: JSON.stringify(data) }),
  allotFacilities: (data) => request('/auth/allot-facilities', { method: 'POST', body: JSON.stringify(data) }),
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/auth/users${query ? `?${query}` : ''}`);
  },
  getMe: () => request('/auth/me'),

  // Facilities (Toilet Centers)
  getFacilities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/facilities${query ? `?${query}` : ''}`);
  },
  getFacility: (idOrCode) => request(`/facilities/${idOrCode}`),
  createFacility: (data) => request('/facilities', { method: 'POST', body: JSON.stringify(data) }),
  updateFacility: (id, data) => request(`/facilities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStaffStatus: (id, data) => request(`/facilities/${id}/staff-status`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteFacility: (id) => request(`/facilities/${id}`, { method: 'DELETE' }),

  // Complaints & Visitor Grievances
  getComplaints: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/complaints${query ? `?${query}` : ''}`);
  },
  createComplaint: (data) => request('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  resolveComplaint: (id, data) => request(`/complaints/${id}/resolve`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Tasks & Sanitation Duty
  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tasks${query ? `?${query}` : ''}`);
  },
  getTask: (id) => request(`/tasks/${id}`),
  createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  startTask: (id, data = {}) => request(`/tasks/${id}/start`, { method: 'PATCH', body: JSON.stringify(data) }),
  completeTask: (id, data = {}) => request(`/tasks/${id}/complete`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Staff
  getStaff: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/staff${query ? `?${query}` : ''}`);
  },
  getStaffStats: () => request('/staff/stats'),
  createStaff: (data) => request('/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id, data) => request(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Telemetry & IoT simulation
  updateTelemetry: (id, data) => request(`/telemetry/update/${id}`, { method: 'POST', body: JSON.stringify(data) }),
  simulateSensor: (data) => request('/telemetry/simulate', { method: 'POST', body: JSON.stringify(data) }),
};
