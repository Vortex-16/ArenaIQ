import React, { useState } from 'react';
import { 
  Trophy, 
  Activity, 
  MessageSquare, 
  LogIn, 
  UserPlus, 
  Shield, 
  Navigation,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { authService } from '../services/authService';
import { validateEmail, validatePassword } from '../utils/sanitize';

export default function LandingPage({ onLoginSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Client-side validation before hitting the auth service
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      setErrorMsg(emailCheck.error);
      return;
    }
    const passCheck = validatePassword(password);
    if (!passCheck.valid) {
      setErrorMsg(passCheck.error);
      return;
    }

    setIsLoading(true);
    try {
      if (isLoginTab) {
        const user = await authService.signIn(email, password);
        onLoginSuccess(user);
      } else {
        const user = await authService.signUp(email, password);
        setSignupSuccess(true);
        setTimeout(() => {
          onLoginSuccess(user);
        }, 1000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (roleType) => {
    if (roleType === 'staff') {
      setEmail('staff@fifa.com');
      setPassword('password123');
    } else {
      setEmail('fan.guide@worldcup.com');
      setPassword('securepass');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '3rem',
        alignItems: 'center'
      }}>
        {/* Left Side: Brand Intro & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Trophy size={40} style={{ color: 'var(--primary)' }} />
              <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1 }}>
                Arena<span style={{ color: 'var(--primary)' }}>IQ</span>
              </h1>
            </div>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              FIFA World Cup 2026 Smart Stadium Platform
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="clay-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#10b981', padding: '0.5rem', borderRadius: '12px', color: '#fff' }}>
                <Navigation size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>Smart Navigation & Routes</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Interactive gate-to-seat paths with live crowd-aware detours and accessible walkways.
                </p>
              </div>
            </div>

            <div className="clay-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#3b82f6', padding: '0.5rem', borderRadius: '12px', color: '#fff' }}>
                <Activity size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>Real-time Concourse Operations</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Live restroom wait-times, food queue estimates, and rapid staff emergency dispatches.
                </p>
              </div>
            </div>

            <div className="clay-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#f59e0b', padding: '0.5rem', borderRadius: '12px', color: '#fff' }}>
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>GenAI Operations Assistant</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Real-time decision support, multilingual fan translations, and automated reporting.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Panel */}
        <div className="clay-card" style={{ padding: '2.5rem', border: '2px solid var(--border-color)' }}>
          {/* Tab switches */}
          <div style={{
            display: 'flex',
            backgroundColor: '#10141e',
            padding: '0.4rem',
            borderRadius: '16px',
            boxShadow: 'var(--clay-shadow-input)',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => { setIsLoginTab(true); setErrorMsg(''); }}
              style={{
                flex: 1,
                border: 'none',
                background: isLoginTab ? 'var(--bg-card)' : 'none',
                color: isLoginTab ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.6rem',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: isLoginTab ? 'var(--clay-shadow-button)' : 'none',
                transition: 'var(--transition-smooth)'
              }}
              type="button"
            >
              <LogIn size={14} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
              <span>Login</span>
            </button>
            <button
              onClick={() => { setIsLoginTab(false); setErrorMsg(''); }}
              style={{
                flex: 1,
                border: 'none',
                background: !isLoginTab ? 'var(--bg-card)' : 'none',
                color: !isLoginTab ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.6rem',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: !isLoginTab ? 'var(--clay-shadow-button)' : 'none',
                transition: 'var(--transition-smooth)'
              }}
              type="button"
            >
              <UserPlus size={14} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
              <span>Sign Up</span>
            </button>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
            {isLoginTab ? 'Sign In to ArenaIQ' : 'Create Tournament Account'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {errorMsg && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: 'var(--danger)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {errorMsg}
              </div>
            )}

            {signupSuccess && (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--primary)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <CheckCircle size={14} />
                <span>Account Created! Logging in...</span>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }} htmlFor="auth-email">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                className="input-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }} htmlFor="auth-pass">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-pass"
                  type={showPassword ? 'text' : 'password'}
                  className="input-control"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              disabled={isLoading || signupSuccess}
            >
              {isLoading ? 'Processing Securing Link...' : isLoginTab ? 'Login Securely' : 'Sign Up Securely'}
            </button>
          </form>

          {/* Quick-Fill Demonstration Options */}
          <div style={{ marginTop: '2rem', borderTop: '2px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem', textAlign: 'center' }}>
              DEMONSTRATION QUICK AUTHENTICATION
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                onClick={() => handleQuickFill('staff')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.5rem' }}
                disabled={isLoading}
                type="button"
              >
                <Shield size={12} style={{ marginRight: '0.2rem', color: 'var(--danger)' }} />
                <span>Fill Staff Admin</span>
              </button>
              <button
                onClick={() => handleQuickFill('fan')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.5rem' }}
                disabled={isLoading}
                type="button"
              >
                <Navigation size={12} style={{ marginRight: '0.2rem', color: 'var(--primary)' }} />
                <span>Fill Fan User</span>
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.8rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Note: Logging in as <strong>staff@fifa.com</strong> unlocks the Operations Center. Any other email unlocks the Fan Guide.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
