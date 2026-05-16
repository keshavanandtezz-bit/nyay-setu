const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Request failed: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 8000.');
    }
    throw err;
  }
}

// ─── CITIZEN API ───────────────────────────────────────────
export const citizenAPI = {
  searchPrisoner: (q) =>
    request(`/citizen/status/search?q=${encodeURIComponent(q)}`),

  getPrisoner: (id) =>
    request(`/citizen/status/${encodeURIComponent(id)}`),

  getCalendar: (id) =>
    request(`/citizen/calendar/${encodeURIComponent(id)}`),
};

// ─── LEGAL API ─────────────────────────────────────────────
export const legalAPI = {
  getUndertrials: (status = 'all', district = '') => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (district) params.set('district', district);
    const qs = params.toString();
    return request(`/legal/undertrials${qs ? '?' + qs : ''}`);
  },

  getUndertrial: (id) =>
    request(`/legal/undertrial/${id}`),

  getDistricts: () =>
    request('/legal/districts'),

  getStats: () =>
    request('/legal/stats'),
};

// ─── AI API ────────────────────────────────────────────────
export const aiAPI = {
  rightsBot: (messages) =>
    request('/ai/rights-bot', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),

  analyzePDF: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/ai/analyze-case', {
      method: 'POST',
      headers: {},       // Let browser set multipart boundary
      body: formData,
    });
  },

  analyzeText: (text) =>
    request('/ai/analyze-text', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  generateBail: (payload) =>
    request('/ai/generate-bail', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};