/**
 * useDayNight.js
 * Returns a reactive sky descriptor based on the user's real local time.
 * Updates every 60 seconds so the garden gently shifts across the day.
 */

import { useState, useEffect } from 'react';

// ─── Phase definitions ──────────────────────────────────────────────────────
//  Each phase covers a time range [startHour, endHour) and defines all the
//  visual tokens the garden needs.
const PHASES = [
  {
    name: 'deep-night',
    label: '🌙 Night',
    hours: [0, 5],
    // sky gradient: top → bottom
    skyColors: ['#050a1a', '#0a1428', '#0d1a34', '#0a1220'],
    horizonGlow: 'rgba(30,50,120,0.2)',
    sunVisible: false,
    moonVisible: true,
    starsVisible: true,
    firefliesVisible: true,
    birdsVisible: false,
    beesVisible: false,
    cloudOpacity: 0.15,
    ambientTint: 'rgba(10,20,60,0.55)',   // overlay on the whole page
    grassTint: 'rgba(10,20,60,0.45)',
    soilTint:  'rgba(10,20,50,0.5)',
  },
  {
    name: 'dawn',
    label: '🌅 Dawn',
    hours: [5, 7],
    skyColors: ['#1a0e2e', '#4a1e50', '#c05060', '#e88060', '#f5c090'],
    horizonGlow: 'rgba(240,130,80,0.5)',
    sunVisible: true,
    sunPos: { top: '18%', right: '12%' },
    sunColors: ['#ffe4c4', '#ffb870', '#ff8040'],
    moonVisible: false,
    starsVisible: true,
    firefliesVisible: false,
    birdsVisible: false,
    beesVisible: false,
    cloudOpacity: 0.6,
    ambientTint: 'rgba(180,80,40,0.12)',
    grassTint: 'rgba(140,60,20,0.18)',
    soilTint:  'rgba(120,50,10,0.15)',
  },
  {
    name: 'morning',
    label: '🌤 Morning',
    hours: [7, 11],
    skyColors: ['#2d6fa8', '#4a9fd4', '#87c5e8', '#c8e8f5', '#f0f8ff'],
    horizonGlow: 'rgba(200,230,255,0.3)',
    sunVisible: true,
    sunPos: { top: '8%', right: '12%' },
    sunColors: ['#fff8d0', '#ffe060', '#ffb830'],
    moonVisible: false,
    starsVisible: false,
    firefliesVisible: false,
    birdsVisible: true,
    beesVisible: true,
    cloudOpacity: 0.88,
    ambientTint: 'rgba(255,240,200,0.04)',
    grassTint: 'rgba(0,0,0,0)',
    soilTint:  'rgba(0,0,0,0)',
  },
  {
    name: 'midday',
    label: '☀️ Midday',
    hours: [11, 15],
    skyColors: ['#1a5fa0', '#3a8fd0', '#70b8e8', '#b8dcf0', '#e8f4ff'],
    horizonGlow: 'rgba(180,220,255,0.2)',
    sunVisible: true,
    sunPos: { top: '5%', left: '50%' },
    sunColors: ['#ffffff', '#fff5a0', '#ffe040'],
    moonVisible: false,
    starsVisible: false,
    firefliesVisible: false,
    birdsVisible: true,
    beesVisible: true,
    cloudOpacity: 0.7,
    ambientTint: 'rgba(255,250,230,0.05)',
    grassTint: 'rgba(0,0,0,0)',
    soilTint:  'rgba(0,0,0,0)',
  },
  {
    name: 'afternoon',
    label: '🌤 Afternoon',
    hours: [15, 17],
    skyColors: ['#2d6fa8', '#4a9fd4', '#87c5e8', '#d0e8f8', '#f5dfc2'],
    horizonGlow: 'rgba(245,200,150,0.25)',
    sunVisible: true,
    sunPos: { top: '10%', left: '15%' },
    sunColors: ['#fff8d0', '#ffe060', '#ffb830'],
    moonVisible: false,
    starsVisible: false,
    firefliesVisible: false,
    birdsVisible: true,
    beesVisible: true,
    cloudOpacity: 0.8,
    ambientTint: 'rgba(255,220,150,0.07)',
    grassTint: 'rgba(0,0,0,0)',
    soilTint:  'rgba(0,0,0,0)',
  },
  {
    name: 'golden-hour',
    label: '🌇 Golden Hour',
    hours: [17, 19],
    skyColors: ['#2d6fa8', '#4a9fd4', '#87c5e8', '#c8e8f5', '#f5dfc2', '#e8c490', '#c8935a', '#9c6840'],
    horizonGlow: 'rgba(255,160,60,0.5)',
    sunVisible: true,
    sunPos: { top: '6%', right: '10%' },
    sunColors: ['#fff8d0', '#ffe060', '#ffb830'],
    moonVisible: false,
    starsVisible: false,
    firefliesVisible: false,
    birdsVisible: true,
    beesVisible: false,
    cloudOpacity: 0.88,
    ambientTint: 'rgba(255,160,50,0.1)',
    grassTint: 'rgba(200,100,20,0.12)',
    soilTint:  'rgba(180,80,10,0.1)',
  },
  {
    name: 'dusk',
    label: '🌆 Dusk',
    hours: [19, 21],
    skyColors: ['#1a1040', '#4a1e60', '#9a3a50', '#d06040', '#e89060'],
    horizonGlow: 'rgba(220,100,60,0.5)',
    sunVisible: false,
    moonVisible: true,
    moonPos: { top: '12%', right: '18%' },
    starsVisible: true,
    firefliesVisible: true,
    birdsVisible: false,
    beesVisible: false,
    cloudOpacity: 0.4,
    ambientTint: 'rgba(80,20,60,0.3)',
    grassTint: 'rgba(60,10,50,0.35)',
    soilTint:  'rgba(50,10,40,0.35)',
  },
  {
    name: 'night',
    label: '🌃 Night',
    hours: [21, 24],
    skyColors: ['#050a1a', '#0a1428', '#0d1a34', '#0a1220'],
    horizonGlow: 'rgba(30,50,120,0.2)',
    sunVisible: false,
    moonVisible: true,
    starsVisible: true,
    firefliesVisible: true,
    birdsVisible: false,
    beesVisible: false,
    cloudOpacity: 0.15,
    ambientTint: 'rgba(10,20,60,0.55)',
    grassTint: 'rgba(10,20,60,0.45)',
    soilTint:  'rgba(10,20,50,0.5)',
  },
];

function getPhase(hour) {
  return PHASES.find(p => hour >= p.hours[0] && hour < p.hours[1]) || PHASES[0];
}

/** Returns a value 0-1 showing how far we are through the current phase */
function phaseProgress(date) {
  const h = date.getHours() + date.getMinutes() / 60;
  const phase = getPhase(Math.floor(h));
  const span = phase.hours[1] - phase.hours[0];
  return Math.max(0, Math.min(1, (h - phase.hours[0]) / span));
}

export function useDayNight() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // tick every 30 s — smooth enough, light on the CPU
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const hour = now.getHours() + now.getMinutes() / 60;
  const phase = getPhase(Math.floor(hour));

  return {
    phase,
    hour,
    progress: phaseProgress(now),
    timeString: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export { PHASES };