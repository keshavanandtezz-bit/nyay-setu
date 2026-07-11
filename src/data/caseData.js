// ── Unified Case Data ────────────────────────────────────────────────
// Merges prisoners.js and undertrials.js into one consistent dataset.
// Old files are kept so nothing breaks.

import { prisoners } from './prisoners';
import { undertrials, getBailScore } from './undertrials';

/**
 * Merge prisoner + undertrial records using prisoner_id as the join key.
 * Undertrial records have the richer schema, so they take priority.
 * Prisoners that only exist in prisoners.js are normalized to match.
 */
function buildUnifiedList() {
  const byId = new Map();

  // Start with undertrial records (already have the clean field names)
  undertrials.forEach(u => {
    byId.set(u.prisoner_id, {
      id: u.id,
      name: u.name,
      prisoner_id: u.prisoner_id,
      age: u.age,
      charges: u.charges,
      ipc_sections: u.ipc_sections,
      arrest_date: u.arrest_date,
      court: u.court,
      district: u.district,
      case_status: u.case_status,
      next_hearing: u.next_hearing,
      lawyer: u.lawyer,
      has_lawyer: u.has_lawyer,
      prior_record: u.prior_record,
      offense_type: u.offense_type,
      flight_risk: u.flight_risk,
      prison: u.prison,
    });
  });

  // Add prisoners that aren't already in the undertrials list and enrich
  // existing entries with hearing history from prisoners.js
  prisoners.forEach(p => {
    if (byId.has(p.prisoner_id)) {
      // Enrich with hearing data and extra fields from prisoners.js
      const existing = byId.get(p.prisoner_id);
      existing.hearings = p.hearings || [];
      existing.case_number = p.case_number;
      existing.judge = p.judge;
      existing.family_contact = p.family_contact;
      existing.lawyer_phone = p.lawyer_phone;
    } else {
      // Normalize prisoner record to unified schema
      byId.set(p.prisoner_id, {
        id: p.prisoner_id,
        name: p.prisoner_name,
        prisoner_id: p.prisoner_id,
        age: p.age,
        charges: p.charges,
        ipc_sections: p.ipc_sections,
        arrest_date: p.arrest_date,
        court: p.court,
        district: p.district,
        case_status: p.case_status,
        next_hearing: p.next_hearing_date,
        lawyer: p.lawyer_assigned,
        has_lawyer: !!(p.lawyer_assigned && !p.lawyer_assigned.includes('Not assigned')),
        prior_record: false,
        offense_type: 'non-bailable',
        flight_risk: 'medium',
        prison: p.prison_location,
        // Extra prisoner-only fields
        hearings: p.hearings || [],
        case_number: p.case_number,
        judge: p.judge,
        family_contact: p.family_contact,
        lawyer_phone: p.lawyer_phone,
      });
    }
  });

  return Array.from(byId.values());
}

/** Complete merged dataset */
export const allPrisoners = buildUnifiedList();

/**
 * Search prisoners by name, prisoner_id, or case_number.
 * @param {string} query - Search query
 * @returns {Array} Matching prisoner records
 */
export function searchPrisoners(query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return allPrisoners.filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.prisoner_id || '').toLowerCase().includes(q) ||
    (p.case_number || '').toLowerCase().includes(q) ||
    (p.charges || '').toLowerCase().includes(q)
  );
}

/**
 * Get a single prisoner by their ID (matches prisoner_id or id).
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getPrisonerById(id) {
  if (!id) return undefined;
  const q = id.toLowerCase().trim();
  return allPrisoners.find(p =>
    (p.prisoner_id || '').toLowerCase() === q ||
    (p.id || '').toLowerCase() === q
  );
}

/**
 * Get all hearings for a prisoner, sorted chronologically.
 * @param {string} id - prisoner_id or id
 * @returns {Array} Hearing records, empty array if none
 */
export function getHearingsForPrisoner(id) {
  const prisoner = getPrisonerById(id);
  if (!prisoner || !prisoner.hearings) return [];
  return [...prisoner.hearings].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

// Re-export getBailScore so consumers don't need to import from undertrials
export { getBailScore };
