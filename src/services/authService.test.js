/**
 * ArenaIQ Auth Service — Comprehensive Unit Tests
 *
 * Validates local JWT fallback sign-in, role assignment logic,
 * token structure, session persistence, sign-out cleanup,
 * password validation, and edge-case protection.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from './authService';

// ─────────────────────── sessionStorage Mock ─────────────────────────────────
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();

global.sessionStorage = sessionStorageMock;

// ─────────────────────── Role Assignment ─────────────────────────────────────
describe('Role assignment in localSignIn', () => {
  beforeEach(() => sessionStorage.clear());

  it('assigns "staff" role to staff@fifa.com', async () => {
    const result = await authService.localSignIn('staff@fifa.com', 'password123');
    expect(result.role).toBe('staff');
  });

  it('assigns "fan" role to any non-staff email', async () => {
    const result = await authService.localSignIn('fan.guide@worldcup.com', 'securepass');
    expect(result.role).toBe('fan');
  });

  it('assigns "fan" role to a generic email', async () => {
    const result = await authService.localSignIn('user@example.com', 'pass123');
    expect(result.role).toBe('fan');
  });

  it('is case-insensitive for the staff email check', async () => {
    const result = await authService.localSignIn('STAFF@FIFA.COM', 'pass123');
    expect(result.role).toBe('staff');
  });

  it('stores the email in lowercase in the returned object', async () => {
    const result = await authService.localSignIn('FAN@EXAMPLE.COM', 'pass123');
    expect(result.email).toBe('fan@example.com');
  });
});

// ─────────────────────── JWT Token Structure ─────────────────────────────────
describe('JWT token structure in localSignIn', () => {
  beforeEach(() => sessionStorage.clear());

  it('returns a token with exactly 3 dot-separated parts', async () => {
    const result = await authService.localSignIn('user@test.com', 'pass123');
    const parts = result.token.split('.');
    expect(parts.length).toBe(3);
  });

  it('includes a non-empty header part', async () => {
    const result = await authService.localSignIn('user@test.com', 'pass123');
    expect(result.token.split('.')[0].length).toBeGreaterThan(0);
  });

  it('includes a non-empty payload part', async () => {
    const result = await authService.localSignIn('user@test.com', 'pass123');
    expect(result.token.split('.')[1].length).toBeGreaterThan(0);
  });

  it('token payload encodes the correct email and role', async () => {
    const email = 'verify@test.com';
    const result = await authService.localSignIn(email, 'pass123');
    const payloadB64 = result.token.split('.')[1];
    const decoded = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    expect(decoded.email).toBe(email);
    expect(decoded.role).toBe('fan');
  });

  it('token includes a future expiry timestamp', async () => {
    const result = await authService.localSignIn('user@test.com', 'pass123');
    const payloadB64 = result.token.split('.')[1];
    const decoded = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    expect(decoded.exp).toBeGreaterThan(Date.now());
  });
});

// ─────────────────────── Session Persistence ─────────────────────────────────
describe('Session persistence in sessionStorage', () => {
  beforeEach(() => sessionStorage.clear());

  it('persists the session after localSignIn', async () => {
    await authService.localSignIn('fan@test.com', 'pass123');
    const raw = sessionStorage.getItem('arena_jwt_fallback');
    expect(raw).not.toBeNull();
  });

  it('stored session parses as valid JSON with expected keys', async () => {
    await authService.localSignIn('fan@test.com', 'pass123');
    const parsed = JSON.parse(sessionStorage.getItem('arena_jwt_fallback'));
    expect(parsed).toHaveProperty('email');
    expect(parsed).toHaveProperty('role');
    expect(parsed).toHaveProperty('token');
  });

  it('generates unique tokens on each sign-in call', async () => {
    const r1 = await authService.localSignIn('user@test.com', 'pass');
    const r2 = await authService.localSignIn('user@test.com', 'pass');
    expect(r1.token).not.toBe(r2.token);
  });
});

// ─────────────────────── Sign Out ────────────────────────────────────────────
describe('authService.signOut', () => {
  beforeEach(() => sessionStorage.clear());

  it('removes the fallback session key on sign out', async () => {
    await authService.localSignIn('fan@test.com', 'pass123');
    expect(sessionStorage.getItem('arena_jwt_fallback')).not.toBeNull();
    await authService.signOut();
    expect(sessionStorage.getItem('arena_jwt_fallback')).toBeNull();
  });

  it('does not throw if called when no session exists', async () => {
    await expect(authService.signOut()).resolves.not.toThrow();
  });
});

// ─────────────────────── Input Validation Guards ─────────────────────────────
describe('authService input validation', () => {
  it('throws when email is missing during signIn', async () => {
    await expect(authService.signIn('', 'password')).rejects.toThrow();
  });

  it('throws when password is missing during signIn', async () => {
    await expect(authService.signIn('user@test.com', '')).rejects.toThrow();
  });

  it('throws when email is missing during signUp', async () => {
    await expect(authService.signUp('', 'password')).rejects.toThrow();
  });

  it('throws when password is too short during signUp', async () => {
    await expect(authService.signUp('user@test.com', 'abc')).rejects.toThrow(/6 characters/);
  });
});

// ─────────────────────── isFallbackActive ────────────────────────────────────
describe('authService.isFallbackActive', () => {
  it('returns a boolean value', () => {
    expect(typeof authService.isFallbackActive()).toBe('boolean');
  });
});
