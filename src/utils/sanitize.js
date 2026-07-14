/**
 * ArenaIQ Input Sanitization & Security Utilities
 * 
 * Provides XSS prevention, input length enforcement, and
 * safe string handling for all user-facing input surfaces.
 */

/** Maximum allowed character length for chat input queries */
export const MAX_QUERY_LENGTH = 500;

/** Maximum allowed character length for incident title fields */
export const MAX_INCIDENT_TITLE_LENGTH = 80;

/** Maximum allowed character length for incident description fields */
export const MAX_INCIDENT_DESC_LENGTH = 300;

/** Maximum allowed character length for email fields */
export const MAX_EMAIL_LENGTH = 254;

/**
 * Strips HTML tags and encodes common XSS vectors from a string.
 * @param {string} raw - The raw user input string.
 * @returns {string} A sanitized string safe for display and storage.
 */
export function sanitizeText(raw) {
  if (typeof raw !== 'string') return '';

  return raw
    // Encode angle brackets FIRST (before tag stripping) to preserve entity output
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Encode quotes to prevent attribute injection
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove JS event handlers (after encoding, these appear as plain text)
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Collapse multiple whitespace
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Truncates a string to a given maximum length, appending an ellipsis if needed.
 * @param {string} str - The input string.
 * @param {number} max - The max permitted length.
 * @returns {string} The (possibly truncated) string.
 */
export function truncate(str, max) {
  if (typeof str !== 'string') return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

/**
 * Validates and sanitizes a user-submitted chat query.
 * @param {string} query - The raw query text from the input field.
 * @returns {{ valid: boolean, value: string, error?: string }}
 */
export function validateQuery(query) {
  if (typeof query !== 'string' || query.trim() === '') {
    return { valid: false, value: '', error: 'Query must not be empty.' };
  }
  const sanitized = sanitizeText(query);
  if (sanitized.length > MAX_QUERY_LENGTH) {
    return {
      valid: false,
      value: sanitized.slice(0, MAX_QUERY_LENGTH),
      error: `Query is too long. Maximum ${MAX_QUERY_LENGTH} characters allowed.`
    };
  }
  return { valid: true, value: sanitized };
}

/**
 * Validates an email address format.
 * @param {string} email - The raw email string.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (typeof email !== 'string' || email.trim() === '') {
    return { valid: false, error: 'Email address is required.' };
  }
  if (email.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: 'Email address is too long.' };
  }
  // RFC-5322 simplified pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email format.' };
  }
  return { valid: true };
}

/**
 * Validates a password meets minimum security requirements.
 * @param {string} password - The raw password string.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePassword(password) {
  if (typeof password !== 'string' || password.length === 0) {
    return { valid: false, error: 'Password is required.' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters.' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password must be under 128 characters.' };
  }
  return { valid: true };
}

/**
 * Simple in-memory rate limiter for AI chat requests.
 * Prevents excessive API calls within a rolling time window.
 */
export class RateLimiter {
  /**
   * @param {number} maxRequests - Max number of requests allowed per window.
   * @param {number} windowMs - Rolling window duration in milliseconds.
   */
  constructor(maxRequests = 10, windowMs = 60000) {
    this._max = maxRequests;
    this._window = windowMs;
    this._timestamps = [];
  }

  /**
   * Checks if a new request is permitted.
   * @returns {{ allowed: boolean, retryAfterMs?: number }}
   */
  check() {
    const now = Date.now();
    // Remove timestamps outside the rolling window
    this._timestamps = this._timestamps.filter(t => now - t < this._window);

    if (this._timestamps.length >= this._max) {
      const oldest = this._timestamps[0];
      const retryAfterMs = this._window - (now - oldest);
      return { allowed: false, retryAfterMs };
    }

    this._timestamps.push(now);
    return { allowed: true };
  }

  /** Resets all tracked timestamps (useful for testing). */
  reset() {
    this._timestamps = [];
  }
}
