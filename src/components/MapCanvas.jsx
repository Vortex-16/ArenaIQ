import React, { useRef, useEffect, useState } from 'react';

// Location coordinates in relative percentages (x: 0-100, y: 0-100)
// Center of pitch is at (50, 50)
const LOCATIONS = {
  gates: [
    { name: 'Gate A (North)', x: 50, y: 12, code: 'Gate A' },
    { name: 'Gate B (East)', x: 88, y: 50, code: 'Gate B' },
    { name: 'Gate C (South)', x: 50, y: 88, code: 'Gate C' },
    { name: 'Gate D (West)', x: 12, y: 50, code: 'Gate D' }
  ],
  concessions: [
    { name: 'Libertad Tacos (Sec 104)', x: 74, y: 30, code: 'Sec 104' },
    { name: 'Gridiron Burgers (Sec 112)', x: 74, y: 70, code: 'Sec 112' },
    { name: 'MetLife Craft Brews (Sec 122)', x: 26, y: 70, code: 'Sec 122' },
    { name: 'FIFA Megastore (Sec 130)', x: 26, y: 30, code: 'Sec 130' }
  ],
  restrooms: [
    { name: 'Restroom (Sec 102)', x: 62, y: 20, code: 'Sec 102' },
    { name: 'Restroom (Sec 106)', x: 82, y: 40, code: 'Sec 106' },
    { name: 'Restroom (Sec 118)', x: 38, y: 80, code: 'Sec 118' },
    { name: 'Restroom (Sec 120)', x: 18, y: 60, code: 'Sec 120' },
    { name: 'Restroom (Sec 110)', x: 82, y: 60, code: 'Sec 110' }
  ]
};

// Heat hotspots for congestion simulation (staff mode)
const HEAT_SPOTS = [
  { x: 50, y: 88, radius: 45, intensity: 0.8, name: 'Gate C Bottleneck (Turnstile Failure)' }, // Gate C
  { x: 74, y: 70, radius: 35, intensity: 0.6, name: 'Sec 112 Queue Spillover' }, // Concession Sec 112
  { x: 62, y: 20, radius: 25, intensity: 0.45, name: 'Sec 102 Slip Danger Area' } // Sec 102 Spill
];

export default function MapCanvas({ mode = 'fan', selectedStart, selectedEnd, onSelectLocation, activeStadium }) {
  const canvasRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  // Animate the path dots and crowd pulses
  useEffect(() => {
    let frameId;
    const animate = () => {
      setAnimationFrame(prev => (prev + 1) % 360);
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set resolution dynamically to match display size
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // Coordinate Conversion helpers
    const toPxX = (pct) => (pct / 100) * width;
    const toPxY = (pct) => (pct / 100) * height;

    // 1. Draw Field / Pitch (Green Rectangle in center)
    const pitchW = width * 0.22;
    const pitchH = height * 0.26;
    ctx.fillStyle = '#065f46';
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    
    // Rounded corner pitch background
    ctx.beginPath();
    ctx.roundRect(width/2 - pitchW/2, height/2 - pitchH/2, pitchW, pitchH, 4);
    ctx.fill();
    ctx.stroke();

    // Pitch center circle & lines
    ctx.beginPath();
    ctx.arc(width/2, height/2, width * 0.04, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width/2 - pitchW/2, height/2);
    ctx.lineTo(width/2 + pitchW/2, height/2);
    ctx.stroke();

    // 2. Draw Stadium Seating Ring Outlines (Concentric Ovals)
    const drawRing = (radX, radY, strokeColor, lineWidth, dashed = false) => {
      ctx.beginPath();
      ctx.ellipse(width/2, height/2, radX, radY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      if (dashed) {
        ctx.setLineDash([6, 6]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Inner Stand Ring
    drawRing(width * 0.18, height * 0.22, 'rgba(59, 130, 246, 0.3)', 2);
    // Lower Concourse (Sec 100s)
    drawRing(width * 0.28, height * 0.32, 'rgba(255, 255, 255, 0.1)', 1);
    // Upper Concourse (Sec 200s)
    drawRing(width * 0.38, height * 0.42, 'rgba(255, 255, 255, 0.05)', 1);

    // 3. Draw Staff Mode - Crowd Congestion Heatmap Overlays
    if (mode === 'staff') {
      HEAT_SPOTS.forEach(spot => {
        const spotX = toPxX(spot.x);
        const spotY = toPxY(spot.y);
        
        // Heat radial gradient
        const gradient = ctx.createRadialGradient(
          spotX, spotY, 2, 
          spotX, spotY, spot.radius + Math.sin(animationFrame * 0.05) * 5
        );
        
        // Set colors based on severity
        if (spot.intensity > 0.7) {
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
          gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.2)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        } else if (spot.intensity > 0.5) {
          gradient.addColorStop(0, 'rgba(245, 158, 11, 0.6)');
          gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
          gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
          gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.15)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(spotX, spotY, spot.radius + 10, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 4. Draw Fan Mode - Pathfinding Routes (Gate to Seat/Concession)
    if (mode === 'fan' && selectedStart && selectedEnd) {
      const startLoc = LOCATIONS.gates.find(g => g.code === selectedStart);
      const endLoc = [
        ...LOCATIONS.concessions, 
        ...LOCATIONS.restrooms
      ].find(item => item.code === selectedEnd) || { x: 50, y: 35 }; // default seat area

      if (startLoc && endLoc) {
        const startX = toPxX(startLoc.x);
        const startY = toPxY(startLoc.y);
        const endX = toPxX(endLoc.x);
        const endY = toPxY(endLoc.y);

        // Calculate direct concourse ring routing: curve the path around the stadium center
        // Let's create an arc routing
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // Control point curves around center
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        // Shift midpoint away from center to create concourse route curve
        const centerDistX = midX - width/2;
        const centerDistY = midY - height/2;
        const curveX = midX + (centerDistX * 0.4);
        const curveY = midY + (centerDistY * 0.4);

        ctx.quadraticCurveTo(curveX, curveY, endX, endY);
        
        // Dynamic path neon styling
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;

        // Animated walking dots
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#ffffff';
        ctx.setLineDash([4, 8]);
        ctx.lineDashOffset = -animationFrame * 0.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(curveX, curveY, endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 5. Draw Location Points (Gates, Concessions, Restrooms)
    const drawPoint = (loc, typeColor, typeSize, typeShape) => {
      const locX = toPxX(loc.x);
      const locY = toPxY(loc.y);
      const isHovered = hoveredItem && hoveredItem.name === loc.name;
      const isSelected = selectedStart === loc.code || selectedEnd === loc.code;

      ctx.beginPath();
      ctx.shadowBlur = (isHovered || isSelected) ? 12 : 0;
      ctx.shadowColor = typeColor;

      if (typeShape === 'square') {
        ctx.fillStyle = typeColor;
        ctx.fillRect(locX - typeSize/2, locY - typeSize/2, typeSize, typeSize);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.strokeRect(locX - typeSize/2, locY - typeSize/2, typeSize, typeSize);
      } else if (typeShape === 'triangle') {
        ctx.fillStyle = typeColor;
        ctx.beginPath();
        ctx.moveTo(locX, locY - typeSize/2 - 2);
        ctx.lineTo(locX - typeSize/2 - 2, locY + typeSize/2);
        ctx.lineTo(locX + typeSize/2 + 2, locY + typeSize/2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();
      } else {
        // Circle
        ctx.fillStyle = isSelected ? '#ffffff' : typeColor;
        ctx.arc(locX, locY, typeSize + (isHovered ? 2 : 0), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isSelected ? typeColor : '#ffffff';
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;
    };

    // Draw Restrooms (Blue Triangles)
    LOCATIONS.restrooms.forEach(r => drawPoint(r, '#3b82f6', 8, 'triangle'));

    // Draw Concessions (Gold/Amber Squares)
    LOCATIONS.concessions.forEach(c => drawPoint(c, '#f59e0b', 10, 'square'));

    // Draw Gates (Green Circles)
    LOCATIONS.gates.forEach(g => drawPoint(g, '#10b981', 8, 'circle'));

    // 6. Draw HUD overlays / Legends
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(10, 10, 140, 95);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(10, 10, 140, 95);

    ctx.font = 'bold 9px var(--font-sans)';
    ctx.fillStyle = 'var(--text-primary)';
    ctx.fillText('MAP LEGEND', 15, 22);

    ctx.font = '9px var(--font-sans)';
    // Concessions legend
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(15, 30, 7, 7);
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.fillText('Concessions', 28, 36);

    // Restrooms legend
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(18, 43); ctx.lineTo(14, 49); ctx.lineTo(22, 49); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.fillText('Restrooms', 28, 48);

    // Gates legend
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(18, 59, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.fillText('Stadium Gates', 28, 62);

    // Active path legend
    if (mode === 'fan' && selectedStart && selectedEnd) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(14, 75); ctx.lineTo(24, 75); ctx.stroke();
      ctx.fillStyle = 'var(--text-secondary)';
      ctx.fillText('Smart Route', 28, 77);
    } else if (mode === 'staff') {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.beginPath();
      ctx.arc(18, 75, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'var(--text-secondary)';
      ctx.fillText('Crowd Hotspots', 28, 77);
    }

    // Active venue watermark label in center
    ctx.font = 'bold 12px var(--font-sans)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.textAlign = 'center';
    ctx.fillText(activeStadium.toUpperCase() + ' PITCH', width/2, height/2 - 5);
    ctx.textAlign = 'left';

  }, [mode, selectedStart, selectedEnd, hoveredItem, animationFrame, activeStadium]);

  // Click & Hover interaction handlers
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = canvas.width;
    const height = canvas.height;

    // Check distance to points
    let found = null;
    const allPoints = [
      ...LOCATIONS.gates.map(g => ({ ...g, type: 'gate' })),
      ...LOCATIONS.concessions.map(c => ({ ...c, type: 'concession' })),
      ...LOCATIONS.restrooms.map(r => ({ ...r, type: 'restroom' }))
    ];

    for (const pt of allPoints) {
      const ptX = (pt.x / 100) * width;
      const ptY = (pt.y / 100) * height;
      const distance = Math.hypot(x - ptX, y - ptY);
      
      if (distance < 12) {
        found = pt;
        break;
      }
    }

    setHoveredItem(found);
  };

  const handleMouseClick = () => {
    if (hoveredItem && onSelectLocation) {
      onSelectLocation(hoveredItem);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas 
        ref={canvasRef} 
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: hoveredItem ? 'pointer' : 'default',
        }}
        aria-label="Interactive Stadium Map Layout"
      />
      {hoveredItem && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          padding: '0.4rem 0.8rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid var(--primary)',
          borderRadius: '4px',
          color: 'var(--text-primary)',
          pointerEvents: 'none'
        }}>
          {hoveredItem.name} {mode === 'staff' && hoveredItem.type === 'gate' && hoveredItem.code === 'Gate C' ? ' (Critical Congestion)' : ''}
        </div>
      )}
    </div>
  );
}
