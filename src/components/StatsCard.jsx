import React from 'react';

export default function StatsCard({ title, value, subtext, icon: Icon, trend, color = 'primary' }) {
  const getGlowStyle = () => {
    switch (color) {
      case 'primary': return 'rgba(16, 185, 129, 0.15)';
      case 'secondary': return 'rgba(59, 130, 246, 0.15)';
      case 'warning': return 'rgba(245, 158, 11, 0.15)';
      case 'danger': return 'rgba(239, 68, 68, 0.15)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case 'primary': return 'var(--primary)';
      case 'secondary': return 'var(--secondary)';
      case 'warning': return 'var(--warning)';
      case 'danger': return 'var(--danger)';
      default: return 'var(--border-color)';
    }
  };

  return (
    <div 
      className="glass-panel" 
      style={{
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        borderLeft: `4px solid ${getBorderColor()}`,
        background: `linear-gradient(135deg, ${getGlowStyle()} 0%, rgba(17, 24, 39, 0.8) 100%)`
      }}
    >
      <div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0', color: 'var(--text-primary)' }}>
          {value}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {trend && (
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: trend.startsWith('+') || trend.includes('Good') ? 'var(--primary)' : 'var(--warning)' 
            }}>
              {trend}
            </span>
          )}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtext}</span>
        </div>
      </div>
      
      {Icon && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: getBorderColor()
        }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
