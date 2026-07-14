import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Map, 
  Wrench, 
  FileText,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Truck,
  PlusCircle,
  MapPin,
  ClipboardList
} from 'lucide-react';
import MapCanvas from '../components/MapCanvas';
import AIChat from '../components/AIChat';
import StatsCard from '../components/StatsCard';
import { INITIAL_INCIDENTS, RESOURCE_CREWS } from '../services/mockData';

export default function StaffPortal({ stadiumData, apiConfig, activeStadium }) {
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [crews, setCrews] = useState(RESOURCE_CREWS);
  const [selectedIncident, setSelectedIncident] = useState(INITIAL_INCIDENTS[0]);
  const [showReport, setShowReport] = useState(false);
  const [reportText, setReportText] = useState('');
  const [customIncidentTitle, setCustomIncidentTitle] = useState('');
  const [customIncidentDesc, setCustomIncidentDesc] = useState('');
  const [customIncidentLoc, setCustomIncidentLoc] = useState('Gate A');
  const [customIncidentPri, setCustomIncidentPri] = useState('Medium');

  const activeCount = incidents.filter(i => i.status === 'Active').length;
  const criticalCount = incidents.filter(i => i.status === 'Active' && i.priority === 'Critical').length;
  
  const staffDefaultPrompts = [
    "Gate C bottleneck plan",
    "Spill Sec 102 response",
    "Generate Daily Summary Report"
  ];

  const handleResolveIncident = (incidentId, resolver = 'AI Automated Protocol') => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'Resolved',
          assignedTo: resolver,
          resolution: `Resolved via dispatch of nearest crew. Crowd safety confirmed.`
        };
      }
      return inc;
    }));
    setSelectedIncident(prev => prev.id === incidentId ? {
      ...prev,
      status: 'Resolved',
      assignedTo: resolver,
      resolution: `Resolved via dispatch of nearest crew. Crowd safety confirmed.`
    } : prev);
  };

  const handleAssignCrew = (incidentId, crewName) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'Active',
          assignedTo: crewName
        };
      }
      return inc;
    }));
    
    setCrews(prev => prev.map(c => c.name === crewName ? { ...c, status: 'Busy' } : c));

    setSelectedIncident(prev => prev.id === incidentId ? {
      ...prev,
      assignedTo: crewName
    } : prev);
  };

  const handleCreateIncident = (e) => {
    e.preventDefault();
    if (!customIncidentTitle || !customIncidentDesc) return;
    
    const newInc = {
      id: `inc-${Date.now().toString().slice(-3)}`,
      type: customIncidentTitle,
      location: customIncidentLoc,
      description: customIncidentDesc,
      status: 'Active',
      priority: customIncidentPri,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedTo: null,
      resolution: null
    };

    setIncidents(prev => [newInc, ...prev]);
    setSelectedIncident(newInc);
    setCustomIncidentTitle('');
    setCustomIncidentDesc('');
  };

  const triggerGenerateReport = () => {
    setShowReport(true);
    setReportText(`FIFA WORLD CUP 2026 - MATCHDAY SECURITY & LOGISTICS SUMMARY
VENUE: ${stadiumData.name}
TIMESTAMP: 11:12 AM (Simulated Matchday Live Feed)
---------------------------------------------------

1. OPERATIONAL INCIDENT SUMMARY:
   Total Incidents Logged: ${incidents.length}
   Active Bottlenecks: ${incidents.filter(i => i.status === 'Active').length}
   Resolved Situations: ${incidents.filter(i => i.status === 'Resolved').length}
   
2. DETAILED ACTION REPORT:
${incidents.map(inc => `   - [${inc.priority}] ${inc.type} at ${inc.location} 
     Status: ${inc.status} | Assigned: ${inc.assignedTo || 'Unassigned'}
     Description: ${inc.description}
     ${inc.resolution ? `Resolution: ${inc.resolution}` : ''}
`).join('\n')}

3. GENAI DECISION SUPPORT RECOMMENDATIONS:
   * Gate C Turnstile Congestion: Continue redirecting outbound seating sections to Gate B (East). Clear times estimated at 12 minutes.
   * Section 102 Spill: Rapid response dispatch succeeded. Monitor friction coefficients on flooring over next 30 minutes.
   * Sustainability: Eco-shuttle transit rates have reduced congestion on main freeway links by 14% compared to historical baselines.

Report generated securely by ArenaIQ GenAI Operations Suite.
`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner (Solid background) */}
      <div className="clay-card" style={{
        padding: '1.5rem',
        backgroundColor: '#20161a',
        borderLeft: '6px solid var(--danger)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        transform: 'none'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <ShieldAlert size={28} style={{ color: 'var(--danger)' }} />
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Stadium Command Control Center</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Real-time operations intelligence, crowd safety management, and resource orchestration powered by GenAI.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={triggerGenerateReport} type="button">
            <FileText size={16} />
            <span>Generate Report</span>
          </button>
          <span className="status-badge critical" style={{ padding: '0.5rem 1rem' }}>
            {activeCount} Alerts Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <StatsCard 
          title="Active Alerts" 
          value={activeCount} 
          subtext={`${criticalCount} Critical issues`} 
          icon={AlertTriangle} 
          color={activeCount > 2 ? 'danger' : 'warning'} 
        />
        <StatsCard 
          title="Clearance Rate" 
          value={`${Math.round((incidents.filter(i => i.status === 'Resolved').length / incidents.length) * 100)}%`} 
          subtext="Goal is 95% threshold" 
          icon={CheckCircle} 
          color="primary" 
        />
        <StatsCard 
          title="Response Teams" 
          value={`${crews.filter(c => c.status === 'Available').length}/${crews.length}`} 
          subtext="Available for dispatch" 
          icon={Users} 
          color="secondary" 
        />
        <StatsCard 
          title="Concourse Load" 
          value="98.2%" 
          subtext="Peak gate flow" 
          icon={Map} 
          color="primary" 
        />
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 3.1fr) minmax(0, 1.9fr)',
        gap: '1.5rem'
      }}>
        {/* Left Side: Map and Incident Board */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Heatmap Map */}
          <div className="clay-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live Crowd Density Heatmap</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Visualizing turnstile queue backups and concourse bottlenecks. Red indicates severe density alert.
                </p>
              </div>
              {selectedIncident && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 700 }}>
                  <MapPin size={14} />
                  <span>Inspecting: {selectedIncident.location}</span>
                </div>
              )}
            </div>

            <div className="map-wrapper" style={{ height: '360px' }}>
              <MapCanvas 
                mode="staff"
                selectedStart={selectedIncident?.location.includes('Gate') ? selectedIncident.location.split(' ')[0] + ' ' + selectedIncident.location.split(' ')[1] : null}
                selectedEnd={selectedIncident?.location.includes('Sec') ? selectedIncident.location.split(' ').slice(-2).join(' ') : null}
                onSelectLocation={(loc) => {
                  const matched = incidents.find(inc => inc.location.includes(loc.code));
                  if (matched) setSelectedIncident(matched);
                }}
                activeStadium={activeStadium}
              />
            </div>
          </div>

          {/* Incidents Board */}
          <div className="clay-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
              <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Matchday Incident Board</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {incidents.map((inc) => (
                <div 
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  style={{
                    padding: '1rem',
                    backgroundColor: selectedIncident?.id === inc.id ? 'var(--bg-card-hover)' : '#10141e',
                    border: `2px solid ${selectedIncident?.id === inc.id ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    boxShadow: 'var(--clay-shadow-input)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`status-badge ${inc.priority.toLowerCase()}`}>
                        {inc.priority}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{inc.type}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inc.timestamp}</span>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                    {inc.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Location: <strong style={{ color: 'var(--text-primary)' }}>{inc.location}</strong>
                    </span>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {inc.status === 'Active' ? (
                        <>
                          <select 
                            className="input-control" 
                            style={{ padding: '0.2rem 0.5rem', width: 'auto', fontSize: '0.75rem', height: '28px', borderRadius: '8px' }}
                            value={inc.assignedTo || ''}
                            onChange={(e) => handleAssignCrew(inc.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Assign response crew"
                          >
                            <option value="">-- Assign Crew --</option>
                            {crews.filter(c => c.status === 'Available').map(c => (
                              <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
                            ))}
                          </select>
                          <button 
                            className="btn btn-primary"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '8px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveIncident(inc.id);
                            }}
                            type="button"
                          >
                            Resolve
                          </button>
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                          <CheckCircle size={12} />
                          <span>Resolved ({inc.assignedTo})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: AI Operations and Incident Logging */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* AI Advisor Chat */}
          <AIChat 
            apiConfig={apiConfig}
            defaultPrompts={staffDefaultPrompts}
            contextTitle="Operations Advisor"
          />

          {/* Log New Incident Widget */}
          <div className="clay-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <PlusCircle size={16} style={{ color: 'var(--primary)' }} />
              <span>Log Manual Alert Incident</span>
            </h3>
            
            <form onSubmit={handleCreateIncident} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }} htmlFor="inc-title">
                  Incident Type / Category
                </label>
                <input 
                  id="inc-title"
                  type="text" 
                  className="input-control" 
                  placeholder="e.g. Broken Scanner, Medical Slip"
                  value={customIncidentTitle}
                  onChange={(e) => setCustomIncidentTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }} htmlFor="inc-loc">
                    Location
                  </label>
                  <select 
                    id="inc-loc"
                    className="input-control"
                    value={customIncidentLoc}
                    onChange={(e) => setCustomIncidentLoc(e.target.value)}
                    style={{ height: '36px', padding: '0.4rem 0.6rem' }}
                  >
                    <option value="Gate A (North)">Gate A</option>
                    <option value="Gate B (East)">Gate B</option>
                    <option value="Gate C (South)">Gate C</option>
                    <option value="Gate D (West)">Gate D</option>
                    <option value="Concourse Sec 102">Sec 102</option>
                    <option value="Concourse Sec 112">Sec 112</option>
                    <option value="Concourse Sec 122">Sec 122</option>
                    <option value="Concourse Sec 130">Sec 130</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }} htmlFor="inc-pri">
                    Priority
                  </label>
                  <select 
                    id="inc-pri"
                    className="input-control"
                    value={customIncidentPri}
                    onChange={(e) => setCustomIncidentPri(e.target.value)}
                    style={{ height: '36px', padding: '0.4rem 0.6rem' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }} htmlFor="inc-desc">
                  Incident Description
                </label>
                <textarea 
                  id="inc-desc"
                  className="input-control" 
                  rows="2"
                  placeholder="Provide precise details for the responding crew..."
                  value={customIncidentDesc}
                  onChange={(e) => setCustomIncidentDesc(e.target.value)}
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Log Incident & Ask AI
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}
          role="dialog"
          aria-labelledby="report-modal-title"
        >
          <div className="clay-card" style={{
            width: '100%',
            maxWidth: '650px',
            backgroundColor: 'var(--bg-dark)',
            border: '2px solid var(--primary)',
            padding: '2rem',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 id="report-modal-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
              FIFA World Cup 2026 - Operations Report
            </h2>
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'Courier New, monospace',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              backgroundColor: '#10141e',
              padding: '1rem',
              borderRadius: '16px',
              border: '2px solid var(--border-color)',
              marginBottom: '1.5rem',
              maxHeight: '400px',
              overflowY: 'auto',
              boxShadow: 'var(--clay-shadow-input)'
            }}>
              {reportText}
            </pre>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowReport(false)} type="button">
                Close
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  const blob = new Blob([reportText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ArenaIQ_${activeStadium}_OpsReport.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                type="button"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
