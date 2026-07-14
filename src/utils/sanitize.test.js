/**
 * ArenaIQ Sanitization & Security Utilities — Unit Tests
 *
 * Validates XSS stripping, field length enforcement, rate limiting,
 * email/password validation, and edge-case handling.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  sanitizeText,
  truncate,
  validateQuery,
  validateEmail,
  validatePassword,
  RateLimiter,
  MAX_QUERY_LENGTH,
  MAX_EMAIL_LENGTH,
} from './sanitize';

// ───────────────────────────── sanitizeText ─────────────────────────────────
describe('sanitizeText', () => {
  it('strips HTML tags from input', () => {
    expect(sanitizeText('<script>alert("xss")</script>Hello')).not.toContain('<script>');
    expect(sanitizeText('<b>bold</b>')).not.toContain('<b>');
  });

  it('encodes angle brackets to HTML entities', () => {
    const result = sanitizeText('<img src=x onerror=alert(1)>');
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
  });

  it('removes javascript: protocol strings', () => {
    const result = sanitizeText('javascript:void(0)');
    expect(result.toLowerCase()).not.toContain('javascript:');
  });

  it('removes inline event handlers', () => {
    const result = sanitizeText('onclick=alert(1) text');
    expect(result).not.toMatch(/on\w+\s*=/i);
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
    expect(sanitizeText(42)).toBe('');
  });

  it('collapses excessive whitespace', () => {
    const result = sanitizeText('hello   world');
    expect(result).toBe('hello world');
  });

  it('trims leading and trailing spaces', () => {
    expect(sanitizeText('  hello  ')).toBe('hello');
  });

  it('encodes double and single quotes', () => {
    const result = sanitizeText('"quoted" and \'single\'');
    expect(result).toContain('&quot;');
    expect(result).toContain('&#x27;');
  });
});

// ───────────────────────────── truncate ─────────────────────────────────────
describe('truncate', () => {
  it('returns the string unchanged if within limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and appends ellipsis when over limit', () => {
    const result = truncate('hello world', 5);
    expect(result).toBe('hello…');
    expect(result.length).toBeLessThanOrEqual(6);
  });

  it('returns empty string for non-string input', () => {
    expect(truncate(null, 10)).toBe('');
    expect(truncate(undefined, 10)).toBe('');
  });
});

// ───────────────────────────── validateQuery ────────────────────────────────
describe('validateQuery', () => {
  it('accepts a valid short query', () => {
    const result = validateQuery('Where is Gate B?');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('Where is Gate B?');
  });

  it('rejects an empty string', () => {
    const result = validateQuery('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects a whitespace-only string', () => {
    const result = validateQuery('   ');
    expect(result.valid).toBe(false);
  });

  it('rejects a query that exceeds MAX_QUERY_LENGTH', () => {
    const longQuery = 'a'.repeat(MAX_QUERY_LENGTH + 50);
    const result = validateQuery(longQuery);
    expect(result.valid).toBe(false);
    expect(result.error).toContain(String(MAX_QUERY_LENGTH));
  });

  it('strips XSS vectors from the returned value', () => {
    const result = validateQuery('<script>xss</script>transport');
    expect(result.value).not.toContain('<script>');
  });
});

// ───────────────────────────── validateEmail ────────────────────────────────
describe('validateEmail', () => {
  it('accepts a well-formed email address', () => {
    expect(validateEmail('fan@worldcup.com').valid).toBe(true);
    expect(validateEmail('staff@fifa.com').valid).toBe(true);
  });

  it('rejects an email missing the @ symbol', () => {
    expect(validateEmail('notanemail.com').valid).toBe(false);
  });

  it('rejects an email missing the domain extension', () => {
    expect(validateEmail('user@nodot').valid).toBe(false);
  });

  it('rejects empty input', () => {
    expect(validateEmail('').valid).toBe(false);
    expect(validateEmail('  ').valid).toBe(false);
  });

  it('rejects an email exceeding MAX_EMAIL_LENGTH characters', () => {
    const longEmail = 'a'.repeat(MAX_EMAIL_LENGTH) + '@x.com';
    expect(validateEmail(longEmail).valid).toBe(false);
  });
});

// ───────────────────────────── validatePassword ─────────────────────────────
describe('validatePassword', () => {
  it('accepts a password with 6+ characters', () => {
    expect(validatePassword('secure1').valid).toBe(true);
    expect(validatePassword('password123').valid).toBe(true);
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = validatePassword('abc');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('6');
  });

  it('rejects an empty password', () => {
    expect(validatePassword('').valid).toBe(false);
  });

  it('rejects a password exceeding 128 characters', () => {
    const longPass = 'x'.repeat(129);
    expect(validatePassword(longPass).valid).toBe(false);
  });
});

// ───────────────────────────── RateLimiter ──────────────────────────────────
describe('RateLimiter', () => {
  let limiter;

  beforeEach(() => {
    limiter = new RateLimiter(3, 60000); // 3 requests per minute
  });

  it('allows requests within the permitted limit', () => {
    expect(limiter.check().allowed).toBe(true);
    expect(limiter.check().allowed).toBe(true);
    expect(limiter.check().allowed).toBe(true);
  });

  it('blocks the request when limit is exceeded', () => {
    limiter.check();
    limiter.check();
    limiter.check();
    const result = limiter.check();
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it('resets correctly and allows requests again', () => {
    limiter.check();
    limiter.check();
    limiter.check();
    limiter.reset();
    expect(limiter.check().allowed).toBe(true);
  });
});
