// ── Shared utility functions for Nyay Setu ──────────────────────────
// Used across citizen and legal components to avoid code duplication.

/**
 * Calculate the number of days a person has been in custody.
 * @param {string} arrestDateStr - ISO date string (e.g. '2024-01-15')
 * @returns {number} Number of whole days in custody (minimum 0)
 */
export function daysInCustody(arrestDateStr) {
  if (!arrestDateStr) return 0;
  const arrest = new Date(arrestDateStr);
  const today = new Date();
  const days = Math.floor((today - arrest) / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

/**
 * Determine alert status based on days in custody.
 * @param {number} days - Days in custody
 * @returns {'red'|'yellow'|'green'} Alert severity
 */
export function getAlertStatus(days) {
  if (days > 90) return 'red';
  if (days > 60) return 'yellow';
  return 'green';
}

/**
 * Map alert status to a hex color for display.
 * @param {'red'|'yellow'|'green'} status
 * @returns {string} Hex color string
 */
export function getAlertColor(status) {
  const colors = {
    red: '#e24b4a',
    yellow: '#ef9f27',
    green: '#1d9e75',
  };
  return colors[status] || colors.green;
}

/**
 * Format an ISO date string to a readable Indian locale string.
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date (e.g. '15 Jan 2024')
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Calculate the number of days until a hearing. Can be negative if the
 * hearing date has already passed.
 * @param {string} hearingDateStr - ISO date string for the hearing
 * @returns {number} Days until hearing (negative = past)
 */
export function daysUntilHearing(hearingDateStr) {
  if (!hearingDateStr) return 0;
  const hearing = new Date(hearingDateStr);
  const today = new Date();
  return Math.ceil((hearing - today) / (1000 * 60 * 60 * 24));
}

/**
 * Map a bail score (0-100) to a hex color.
 * @param {number} score - Bail eligibility score
 * @returns {string} Hex color string
 */
export function getBailScoreColor(score) {
  if (score >= 60) return '#1d9e75';
  if (score >= 40) return '#ef9f27';
  return '#e24b4a';
}

/**
 * Truncate text to a maximum length with ellipsis.
 * @param {string} text - Input text
 * @param {number} maxLen - Maximum character length (default 100)
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLen = 100) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}
