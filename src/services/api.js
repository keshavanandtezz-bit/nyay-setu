const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const GROQ_KEY = process.env.REACT_APP_GROQ_API_KEY || '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

// ── Generic backend request ──────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── Direct Groq call (fallback when backend is down) ────────────────
async function callGroqDirect(messages, systemPrompt = '') {
  if (!GROQ_KEY) throw new Error('No Groq API key configured in frontend .env');

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
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

  getUndertrial: (id) =>
    request(`/legal/undertrial/${id}`),

  getDistricts: () =>
    request('/legal/districts'),

  getStats: () =>
    request('/legal/stats'),
};

// ── AI API — backend first, Groq direct fallback ─────────────────────
export const aiAPI = {

  rightsBot: async (messages) => {
    // Try backend first
    try {
      const data = await request('/ai/rights-bot', {
        method: 'POST',
        body: JSON.stringify({ messages }),
      });
      if (data.reply) return data;
    } catch (e) {
      console.warn('Backend unavailable for rightsBot, using direct Groq:', e.message);
    }

    // Fallback — call Groq directly
    const reply = await callGroqDirect(messages,
      `You are Nyay Sahayak, a compassionate legal rights assistant for Indian citizens.
Explain Indian laws and rights in simple plain English.
Never give specific legal advice — always suggest consulting a lawyer.
Keep answers under 200 words. Use bullet points for lists.
When relevant mention free legal aid helpline: 15100.
Focus on: IPC, CrPC, bail rights, undertrial rights, FIR procedures, legal aid, domestic violence.`
    );
    return { reply };
  },

  analyzePDF: async (file) => {
    // PDF analysis always needs backend (file upload)
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${BASE_URL}/ai/analyze-case`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      return res.json();
    } catch (e) {
      throw new Error('PDF upload requires backend. Make sure Render is running.');
    }
  },

  analyzeText: async (text) => {
    // Try backend first
    try {
      const data = await request('/ai/analyze-text', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      if (data.success) return data;
    } catch (e) {
      console.warn('Backend unavailable for analyzeText, using direct Groq:', e.message);
    }

    // Fallback — call Groq directly
    const words = text.split(/\s+/).slice(0, 3500).join(' ');
    const reply = await callGroqDirect(
      [{ role: 'user', content: `Analyze this Indian court document and return ONLY valid JSON:\n\n${words}` }],
      `You are Nyay Mitra, an AI legal assistant for Indian courts.
Analyze the case document and return ONLY valid JSON with no extra text, no markdown, no backticks.
Use this exact structure:
{
  "case_title": "State vs. Accused Name",
  "case_number": "Full case number",
  "court": "Name of court",
  "judge": "Judge name or Unknown",
  "accused": ["Name 1"],
  "charges": ["Charge 1"],
  "ipc_sections": ["IPC 420"],
  "bail_status": "Denied / Granted / Not Applied",
  "current_status": "Current stage of trial",
  "key_facts": ["Fact 1", "Fact 2", "Fact 3"],
  "important_dates": [{"event": "FIR Filed", "date": "DD.MM.YYYY"}],
  "summary": "3 sentence plain English summary.",
  "next_hearing": "DD.MM.YYYY or Unknown",
  "witnesses_total": 0,
  "witnesses_examined": 0
}`
    );

    try {
      const clean = reply.replace(/```json|```/g, '').trim();
      const analysis = JSON.parse(clean);
      return { success: true, analysis };
    } catch {
      throw new Error('Could not parse AI response. Please try again.');
    }
  },

  generateBail: async (payload) => {
    // Try backend first
    try {
      const data = await request('/ai/generate-bail', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (data.success) return data;
    } catch (e) {
      console.warn('Backend unavailable for generateBail, using direct Groq:', e.message);
    }

    // Fallback — call Groq directly
    const today = new Date().toLocaleDateString('en-IN',
      { day: 'numeric', month: 'long', year: 'numeric' });

    const application = await callGroqDirect(
      [{
        role: 'user',
        content: `Generate a complete formal bail application for Indian court:

Name: ${payload.prisoner_name}
Age: ${payload.age} years
Prisoner ID: ${payload.prisoner_id}
Charges: ${payload.charges}
IPC Sections: ${payload.ipc_sections}
Court: ${payload.court}
District: ${payload.district}
Date of Arrest: ${payload.arrest_date}
Days in Custody: ${payload.days_in_custody} days
Prior Criminal Record: ${payload.has_prior_record ? 'Yes' : 'No'}
Current Status: ${payload.case_status}
Legal Representation: ${payload.lawyer}
Today's Date: ${today}

Generate a complete bail application with court header, grounds for bail emphasizing 
${payload.days_in_custody} days custody, Article 21 personal liberty, prayer clause, and verification.`
      }],
      `You are an expert Indian criminal lawyer. Generate formal professional bail applications 
for Indian courts using proper legal language and CrPC Section 437/439 structure.`
    );

    return { success: true, application };
  },
};