import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Settings, 
  Compass, 
  Award, 
  HelpCircle, 
  Key, 
  Info,
  Eye,
  EyeOff,
  LogOut,
  User,
  Shield,
  Menu
} from 'lucide-react';

export default function Sidebar({ 
  activePortal, 
  setActivePortal, 
  activeStadium, 
  setActiveStadium, 
  apiConfig, 
  setApiConfig,
  currentUser,
  onLogout
}) {
  const [showKey, setShowKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyChange = (e) => {
    setApiConfig(prev => ({ ...prev, key: e.target.value }));
  };

  const handleServiceChange = (e) => {
    setApiConfig(prev => ({ ...prev, service: e.target.value }));
  };

  return (
    <>
      {/* Mobile nav toggle */}
      <button 
        className="mobile-nav-toggle btn btn-primary"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          display: 'none', 
        }}
        aria-label="Toggle navigation menu"
      >
        <Menu size={18} />
      </button>

      <aside className={`sidebar clay-card ${isOpen ? 'open' : ''}`} style={{
        position: 'fixed',
        left: '1rem',
        top: '1rem',
        bottom: '1rem',
        width: '260px',
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        border: '2px solid var(--border-color)',
        borderRadius: '24px',
        overflowY: 'auto'
      }}>
        {/* Brand */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Award size={24} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>ArenaIQ</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>
            FIFA WORLD CUP 2026
          </p>
        </div>

        {/* User Session Info Panel */}
        {currentUser && (
          <div className="clay-card" style={{ 
            padding: '0.75rem 1rem', 
            marginBottom: '1.5rem', 
            background: '#10141e',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            boxShadow: 'var(--clay-shadow-input)',
            borderRadius: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {currentUser.role === 'staff' ? (
                <Shield size={14} style={{ color: 'var(--danger)' }} />
              ) : (
                <User size={14} style={{ color: 'var(--primary)' }} />
              )}
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: currentUser.role === 'staff' ? 'var(--danger)' : 'var(--primary)' }}>
                {currentUser.role === 'staff' ? 'Staff Admin' : 'Fan Guide'}
              </span>
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {currentUser.email}
            </div>
          </div>
        )}

        {/* Portal Switcher */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Portal Mode
          </span>
          <button 
            className={`btn ${activePortal === 'fan' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActivePortal('fan')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
            aria-selected={activePortal === 'fan'}
          >
            <Compass size={18} />
            <span>Fan Guide</span>
          </button>
          
          <button 
            className={`btn ${activePortal === 'staff' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              if (currentUser?.role !== 'staff') {
                alert('Access restricted to Staff accounts only. Log in with staff@fifa.com to access the Command Center.');
                return;
              }
              setActivePortal('staff');
            }}
            style={{ width: '100%', justifyContent: 'flex-start', position: 'relative' }}
            aria-selected={activePortal === 'staff'}
          >
            <ShieldAlert size={18} />
            <span>Staff Command</span>
            {currentUser?.role !== 'staff' && (
              <span style={{ 
                position: 'absolute', 
                right: '0.75rem', 
                fontSize: '0.65rem', 
                background: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--danger)',
                padding: '0.1rem 0.4rem',
                borderRadius: '6px',
                border: '1px solid var(--danger)'
              }}>
                Lock
              </span>
            )}
          </button>
        </div>

        {/* Stadium Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Match Venue
          </span>
          <select 
            className="input-control"
            value={activeStadium}
            onChange={(e) => setActiveStadium(e.target.value)}
            style={{ padding: '0.6rem 0.8rem' }}
            aria-label="Select match stadium venue"
          >
            <option value="metlife">MetLife Stadium (NY/NJ)</option>
            <option value="sofi">SoFi Stadium (Los Angeles)</option>
            <option value="mercedes">Mercedes-Benz Stadium (Atlanta)</option>
          </select>
        </div>

        {/* GenAI Settings */}
        <div className="clay-card" style={{ 
          marginTop: 'auto', 
          padding: '1rem', 
          background: '#10141e',
          boxShadow: 'var(--clay-shadow-input)',
          borderRadius: '16px',
          border: '2px solid var(--border-color)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Settings size={14} style={{ color: 'var(--secondary)' }} />
            <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              GenAI Engine
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }} htmlFor="ai-model-select">Provider</label>
            <select 
              id="ai-model-select"
              className="input-control" 
              value={apiConfig.service} 
              onChange={handleServiceChange}
              style={{ padding: '0.4rem 0.5rem', fontSize: '0.8rem', height: '32px' }}
            >
              <option value="mock">Local Simulated AI</option>
              <option value="gemini">Gemini 2.5 Flash API</option>
              <option value="groq">Groq Llama 3 API</option>
            </select>

            {apiConfig.service !== 'mock' && (
              <>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} htmlFor="ai-key-input">
                  <span>API Key</span>
                  <button 
                    onClick={() => setShowKey(!showKey)} 
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    type="button"
                    aria-label={showKey ? "Hide API key" : "Show API key"}
                  >
                    {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    id="ai-key-input"
                    type={showKey ? "text" : "password"} 
                    className="input-control"
                    placeholder="Enter Key..."
                    value={apiConfig.key}
                    onChange={handleKeyChange}
                    style={{ padding: '0.4rem 0.5rem', fontSize: '0.8rem', paddingRight: '2rem', height: '32px' }}
                  />
                  <Key size={12} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button 
            className="btn btn-danger"
            onClick={onLogout}
            style={{ width: '100%', fontSize: '0.8rem', padding: '0.6rem' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-110%);
            transition: var(--transition-smooth);
            background: var(--bg-sidebar) !important;
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .mobile-nav-toggle {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}
