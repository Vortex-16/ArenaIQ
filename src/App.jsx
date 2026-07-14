import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FanPortal from './portals/FanPortal';
import StaffPortal from './portals/StaffPortal';
import LandingPage from './portals/LandingPage';
import { STADIUMS } from './services/mockData';
import { authService } from './services/authService';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Award, ShieldAlert, Navigation } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePortal, setActivePortal] = useState('fan');
  const [activeStadium, setActiveStadium] = useState('metlife');
  const [apiConfig, setApiConfig] = useState({
    service: import.meta.env.VITE_AI_SERVICE || 'mock',
    key: import.meta.env.VITE_AI_API_KEY || ''
  });
  const [authChecked, setAuthChecked] = useState(false);

  // Sync auth state with real Firebase Auth listener or fallback storage
  useEffect(() => {
    if (!auth) {
      const fallbackSession = sessionStorage.getItem('arena_jwt_fallback');
      if (fallbackSession) {
        try {
          const parsed = JSON.parse(fallbackSession);
          setCurrentUser(parsed);
          setActivePortal(parsed.role === 'staff' ? 'staff' : 'fan');
        } catch (err) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthChecked(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const role = user.email.toLowerCase() === 'staff@fifa.com' ? 'staff' : 'fan';
          setCurrentUser({
            email: user.email,
            role,
            token
          });
          setActivePortal(role === 'staff' ? 'staff' : 'fan');
        } catch (e) {
          console.error('Error fetching user JWT token:', e);
          setCurrentUser(null);
        }
      } else {
        // Check if a fallback session exists
        const fallbackSession = sessionStorage.getItem('arena_jwt_fallback');
        if (fallbackSession) {
          try {
            const parsed = JSON.parse(fallbackSession);
            setCurrentUser(parsed);
            setActivePortal(parsed.role === 'staff' ? 'staff' : 'fan');
          } catch (err) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setAuthChecked(true);
    });
    
    return unsubscribe;
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActivePortal(user.role === 'staff' ? 'staff' : 'fan');
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
  };

  if (!authChecked) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Securing Connection...</p>
      </div>
    );
  }

  // Render Landing Page if not logged in
  if (!currentUser) {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  const currentStadiumData = STADIUMS[activeStadium];

  return (
    <div className="app-container">
      {/* Sidebar navigation & Config Panels */}
      <Sidebar 
        activePortal={activePortal} 
        setActivePortal={setActivePortal} 
        activeStadium={activeStadium} 
        setActiveStadium={setActiveStadium}
        apiConfig={apiConfig}
        setApiConfig={setApiConfig}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="main-content" id="main-content">
        <header style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '2px solid var(--border-color)',
          paddingBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award style={{ color: 'var(--primary)' }} />
              <span className="text-highlight">ArenaIQ Matchday Operations</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              FIFA World Cup 2026 Smart Stadium Command & Fan Guide
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Session: <strong style={{ color: 'var(--text-primary)' }}>{currentUser.email}</strong>
              {sessionStorage.getItem('arena_jwt_fallback') && (
                <span style={{ fontSize: '0.7rem', color: 'var(--warning)', marginLeft: '0.4rem' }}>(Local API)</span>
              )}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                boxShadow: '0 0 8px var(--primary)'
              }} className="beacon-pulse" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Operations Live
              </span>
            </div>
          </div>
        </header>

        {/* Portal Switching */}
        {activePortal === 'fan' ? (
          <FanPortal 
            stadiumData={currentStadiumData} 
            apiConfig={apiConfig}
            activeStadium={activeStadium}
          />
        ) : (
          <StaffPortal 
            stadiumData={currentStadiumData} 
            apiConfig={apiConfig}
            activeStadium={activeStadium}
          />
        )}
      </main>
    </div>
  );
}
