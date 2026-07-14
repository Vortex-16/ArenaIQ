import React, { useState } from 'react';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Award, 
  TrendingUp, 
  CheckCircle,
  HelpCircle,
  Accessibility,
  Flame,
  Utensils,
  LogOut,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import MapCanvas from '../components/MapCanvas';
import AIChat from '../components/AIChat';
import StatsCard from '../components/StatsCard';

export default function FanPortal({ stadiumData, apiConfig, activeStadium }) {
  const [selectedStart, setSelectedStart] = useState('Gate C');
  const [selectedEnd, setSelectedEnd] = useState('Sec 104');
  const [ecoPoints, setEcoPoints] = useState(0);
  const [completedEcoActions, setCompletedEcoActions] = useState([]);

  const ecoActions = [
    { id: 'transit', label: 'Took Metro / Train to Stadium', points: 30, desc: 'Avoided solo rideshare or driving' },
    { id: 'recycle', label: 'Recycled Plastic Bottle at Green Bin', points: 15, desc: 'Sorted recyclables correctly' },
    { id: 'cup', label: 'Used Refillable Water Station', points: 15, desc: 'Zero plastic waste footprint' },
    { id: 'clean', label: 'Kept seating area free of litter', points: 20, desc: 'Assisted stadium cleanup' }
  ];

  const handleLogEcoAction = (action) => {
    if (completedEcoActions.includes(action.id)) return;
    setEcoPoints(prev => prev + action.points);
    setCompletedEcoActions(prev => [...prev, action.id]);
  };

  const handleMapClickLocation = (location) => {
    if (location.type === 'gate') {
      setSelectedStart(location.code);
    } else {
      setSelectedEnd(location.code);
    }
  };

  const getBadgeName = () => {
    if (ecoPoints >= 80) return 'Elite Eco Champion';
    if (ecoPoints >= 45) return 'Green Fan Pro';
    if (ecoPoints >= 20) return 'Eco Supporter';
    return 'Conscious Fan';
  };

  const fanDefaultPrompts = [
    "Can I bring a camera?",
    "Where are wheelchair seats?",
    "How to get transit discount?",
    "Where can I recycle bottles?"
  ];

  const calculateWalkingTime = () => {
    if (!selectedStart || !selectedEnd) return null;
    return '4 minutes';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner (Solid colors only) */}
      <div className="clay-card" style={{
        padding: '1.5rem',
        backgroundColor: '#1b2234',
        borderLeft: '6px solid var(--primary)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        transform: 'none'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome to {stadiumData.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Enjoy the FIFA World Cup 2026. Use the interactive tools below to navigate and earn green rewards.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
          <span className="status-badge success" style={{ padding: '0.5rem 1rem' }}>
            Gates Open & Secure
          </span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <StatsCard 
          title="Ticket Entry Gate" 
          value={selectedStart || "Select Gate"} 
          subtext="Recommended Gate Route" 
          icon={Navigation} 
          color="primary" 
        />
        <StatsCard 
          title="Destination Spot" 
          value={selectedEnd || "Select Spot"} 
          subtext="Walking path active" 
          icon={MapPin} 
          color="secondary" 
        />
        <StatsCard 
          title="Green Eco XP" 
          value={`${ecoPoints} XP`} 
          subtext={getBadgeName()} 
          icon={Award} 
          color="warning" 
        />
        <StatsCard 
          title="Stadium Capacity" 
          value={stadiumData.capacity.toLocaleString()} 
          subtext="Sold Out Match" 
          icon={TrendingUp} 
          color="primary" 
        />
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 3.1fr) minmax(0, 1.9fr)',
        gap: '1.5rem'
      }}>
        {/* Left Side: Map & Facilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="clay-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Interactive Stadium Guide Map</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Click a Gate (circle) to set Start, and any facility (square/triangle) to draw your walking path.
                </p>
              </div>
              {selectedStart && selectedEnd && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <Clock size={14} />
                  <span>Est. Walk Time: {calculateWalkingTime()}</span>
                </div>
              )}
            </div>

            <div className="map-wrapper" style={{ height: '360px' }}>
              <MapCanvas 
                mode="fan"
                selectedStart={selectedStart}
                selectedEnd={selectedEnd}
                onSelectLocation={handleMapClickLocation}
                activeStadium={activeStadium}
              />
            </div>

            {/* Quick Actions to Select Coordinates */}
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Info size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Select Entrance Gate:</span>
              {stadiumData.gates.map((g) => {
                const code = g.split(' ')[0] + ' ' + g.split(' ')[1];
                return (
                  <button 
                    key={g} 
                    className={`btn ${selectedStart === code ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '12px' }}
                    onClick={() => setSelectedStart(code)}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Concessions & Restroom Lists */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem'
          }}>
            <div className="clay-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Utensils size={16} style={{ color: 'var(--warning)' }} />
                <span>Live Food Concession Wait Times</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stadiumData.facilities.concessions.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedEnd(c.location)}
                    style={{
                      padding: '0.6rem 0.8rem',
                      backgroundColor: selectedEnd === c.location ? 'var(--bg-card-hover)' : '#10141e',
                      border: `2px solid ${selectedEnd === c.location ? 'var(--warning)' : 'var(--border-color)'}`,
                      borderRadius: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      boxShadow: selectedEnd === c.location ? 'var(--clay-shadow-button)' : 'var(--clay-shadow-input)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{c.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        Location: {c.location} • <span style={{ color: 'var(--text-muted)' }}>Popular: {c.popular}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`status-badge ${c.waitTime > 15 ? 'high' : c.waitTime > 8 ? 'medium' : 'success'}`}>
                        {c.waitTime} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="clay-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Accessibility size={16} style={{ color: 'var(--secondary)' }} />
                <span>Restroom Queue Tracker</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stadiumData.facilities.restrooms.map((r) => (
                  <div 
                    key={r.id} 
                    onClick={() => setSelectedEnd(r.location)}
                    style={{
                      padding: '0.6rem 0.8rem',
                      backgroundColor: selectedEnd === r.location ? 'var(--bg-card-hover)' : '#10141e',
                      border: `2px solid ${selectedEnd === r.location ? 'var(--secondary)' : 'var(--border-color)'}`,
                      borderRadius: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      boxShadow: selectedEnd === r.location ? 'var(--clay-shadow-button)' : 'var(--clay-shadow-input)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{r.gender} Restroom</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Location: {r.location}</div>
                    </div>
                    <div>
                      <span className={`status-badge ${r.waitTime > 10 ? 'high' : r.waitTime > 4 ? 'medium' : 'success'}`}>
                        {r.waitTime} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chatbot & Eco Challenge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Chat (AIChat wraps in clay-card) */}
          <AIChat 
            apiConfig={apiConfig}
            defaultPrompts={fanDefaultPrompts}
            contextTitle="Fan Assistant"
          />

          {/* Eco Goal Tracker */}
          <div className="clay-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Flame size={18} style={{ color: 'var(--warning)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Green Fan Goal Challenge</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Sort trash, use sustainable transportation, and reduce emissions to claim official FIFA discounts!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {ecoActions.map((action) => {
                const isLogged = completedEcoActions.includes(action.id);
                return (
                  <div 
                    key={action.id}
                    style={{
                      padding: '0.6rem 0.8rem',
                      backgroundColor: isLogged ? '#101e1a' : '#10141e',
                      border: `2px solid ${isLogged ? 'var(--primary)' : 'var(--border-color)'}`,
                      borderRadius: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: 'var(--clay-shadow-input)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isLogged ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {action.label}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{action.desc}</div>
                    </div>
                    <button
                      className="btn"
                      onClick={() => handleLogEcoAction(action)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.7rem',
                        borderRadius: '12px',
                        backgroundColor: isLogged ? 'transparent' : 'var(--primary)',
                        color: isLogged ? 'var(--primary)' : '#fff',
                        cursor: isLogged ? 'default' : 'pointer',
                        boxShadow: isLogged ? 'none' : 'var(--clay-shadow-button)',
                        borderColor: isLogged ? 'transparent' : 'var(--primary-dark)'
                      }}
                      disabled={isLogged}
                      type="button"
                    >
                      {isLogged ? <CheckCircle size={12} /> : `+${action.points} XP`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
