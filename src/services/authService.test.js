import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from './authService';

// Simple mock for sessionStorage in Node environment
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Assign mock to global context
global.sessionStorage = sessionStorageMock;

describe('authService Fallback Logic', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should auto-assign roles correctly based on email', async () => {
    // Test Staff email mapping
    const staffEmail = 'staff@fifa.com';
    const resultStaff = await authService.localSignIn(staffEmail, 'password123');
    expect(resultStaff.role).toBe('staff');
    expect(resultStaff.email).toBe(staffEmail);

    // Test Fan email mapping
    const fanEmail = 'fan.guide@worldcup.com';
    const resultFan = await authService.localSignIn(fanEmail, 'password123');
    expect(resultFan.role).toBe('fan');
    expect(resultFan.email).toBe(fanEmail);
  });

  it('should create a valid base64 JWT token structure during fallback sign-in', async () => {
    const email = 'fan.user@mail.com';
    const result = await authService.localSignIn(email, 'pass123');
    
    expect(result.token).toBeDefined();
    const tokenParts = result.token.split('.');
    expect(tokenParts.length).toBe(3); // Header, Payload, Signature
  });

  it('should clear sessions on signOut', async () => {
    await authService.localSignIn('test@mail.com', 'pass123');
    expect(sessionStorage.getItem('arena_jwt_fallback')).not.toBeNull();

    await authService.signOut();
    expect(sessionStorage.getItem('arena_jwt_fallback')).toBeNull();
  });
});
