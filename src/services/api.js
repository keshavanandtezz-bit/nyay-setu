// ── Nyay Setu API Client ─────────────────────────────────────────────
// All AI calls are routed through the backend. NO API keys in frontend.

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ── Generic backend request ──────────────────────────────────────────
async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeout || 60000; // Default 60s timeout for cold starts and AI
  const timeout = setTimeout(() => controller.abort(), timeoutMs); 
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Request failed: ${res.status}`);
    }
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

// ── CITIZEN API ──────────────────────────────────────────────────────
export const citizenAPI = {
  searchPrisoner: (q) =>
    request(`/citizen/status/search?q=${encodeURIComponent(q)}`),

  getPrisoner: (id) =>
    request(`/citizen/status/${encodeURIComponent(id)}`),

  getCalendar: (id) =>
    request(`/citizen/calendar/${encodeURIComponent(id)}`),
};

// ── LEGAL API ────────────────────────────────────────────────────────
export const legalAPI = {
  getUndertrials: (status = 'all', district = '') => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (district) params.set('district', district);
    const qs = params.toString();
    return request(`/legal/undertrials${qs ? '?' + qs : ''}`);
  },

  getUndertrial: (id) => request(`/legal/undertrial/${id}`),
  getDistricts: () => request('/legal/districts'),
  getStats: () => request('/legal/stats'),

  // Legal Aid & Precedents
  getLegalAid: (district = '') => {
    const qs = district ? `?district=${encodeURIComponent(district)}` : '';
    return request(`/legal/legal-aid${qs}`);
  },

  getPrecedents: (category = '', q = '') => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    const qs = params.toString();
    return request(`/legal/precedents${qs ? '?' + qs : ''}`);
  },
};

// ── AI API ───────────────────────────────────────────────────────────
// All methods route through backend — no direct LLM calls from frontend.
export const aiAPI = {
  rightsBot: async (messages, language = 'en') => {
    return request('/ai/rights-bot', {
      method: 'POST',
      body: JSON.stringify({ messages, language }),
    });
  },

  analyzePDF: async (file, language = 'en') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    const res = await fetch(`${BASE_URL}/ai/analyze-case`, {
      method: 'POST',
      body: formData,
      // No Content-Type header — browser sets multipart boundary automatically
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `PDF upload failed: ${res.status}`);
    }
    return res.json();
  },

  analyzeText: async (text, language = 'en') => {
    return request('/ai/analyze-text', {
      method: 'POST',
      body: JSON.stringify({ text, language }),
    });
  },

  generateBail: async (payload, language = 'en') => {
    return request('/ai/generate-bail', {
      method: 'POST',
      body: JSON.stringify({ ...payload, language }),
    });
  },

  // ── Phase 3 methods ─────────────────────────────────────────────────
  suggestIPC: async (description, language = 'en') => {
    return request('/ai/suggest-ipc', {
      method: 'POST',
      body: JSON.stringify({ description, language }),
    });
  },

  caseAdvisor: async (caseId, currentStage, question, language = 'en') => {
    return request('/ai/case-advisor', {
      method: 'POST',
      body: JSON.stringify({ caseId, currentStage, question, language }),
    });
  },

  summarizeComplaint: async (complaintData, language = 'en') => {
    return request('/ai/summarize-complaint', {
      method: 'POST',
      body: JSON.stringify({ complaintData, language }),
    });
  },
};

// ── CASE API (Phase 3) ──────────────────────────────────────────────
export const caseAPI = {
  fileComplaint: (data) =>
    request('/case/file-complaint', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCase: (caseId) =>
    request(`/case/${encodeURIComponent(caseId)}`),

  searchCases: (phone = '', name = '') => {
    const params = new URLSearchParams();
    if (phone) params.set('phone', phone);
    if (name) params.set('name', name);
    const qs = params.toString();
    return request(`/case/search${qs ? '?' + qs : ''}`);
  },

  updateStage: (caseId, stage, notes = '') =>
    request(`/case/${encodeURIComponent(caseId)}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage, notes }),
    }),

  uploadDocument: (caseId, metadata) =>
    request(`/case/${encodeURIComponent(caseId)}/documents`, {
      method: 'POST',
      body: JSON.stringify(metadata),
    }),

  getDocuments: (caseId) =>
    request(`/case/${encodeURIComponent(caseId)}/documents`),

  getAnalytics: () =>
    request('/case/analytics'),
};

// ── COURTS API ──────────────────────────────────────────────────────
export const courtsAPI = {
  // Backend route is GET /courts?district=&court_type=
  findCourts: (court_type = '', district = '') => {
    const params = new URLSearchParams();
    if (court_type) params.set('court_type', court_type);
    if (district) params.set('district', district);
    const qs = params.toString();
    return request(`/courts${qs ? '?' + qs : ''}`);
  },

  getDistricts: () => request('/courts/districts'),
  getTypes: () => request('/courts/types'),
};

// ── AUTH API (Phase 3) ──────────────────────────────────────────────
export const authAPI = {
  register: (name, email, password, role) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getProfile: (token) =>
    request('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};