/**
 * WeatherEffects.jsx
 * Particle / overlay effects rendered INSIDE the GardenCanvas based on
 * the current weather condition.
 *
 * Usage (inside GardenCanvas, after <GardenBackground>):
 *   <WeatherEffects condition={weather?.condition} />
 *
 * Supported conditions:
 *   drizzle, rain, heavy-rain → falling raindrops
 *   snow                      → falling snowflakes
 *   fog                       → layered fog gradient overlay
 *   thunderstorm              → rain + random lightning flash
 *   cloudy / partly-cloudy    → subtle extra cloud haze (very light)
 */

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Deterministic drop/flake positions ──────────────────────────────────────
function makeDrops(count, seed = 0) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left:     ((i * 37 + seed * 13 + 5) % 100),
    delay:    ((i * 0.31 + seed * 0.07) % 3),
    duration: 0.55 + ((i * 0.17 + seed * 0.05) % 0.6),
    opacity:  0.45 + ((i * 0.09) % 0.4),
    width:    1 + (i % 2),
    height:   8 + (i % 10),
  }));
}

function makeFlakes(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left:     ((i * 41 + 7) % 100),
    delay:    ((i * 0.43) % 5),
    duration: 3 + ((i * 0.6) % 4),
    size:     4 + (i % 8),
    wobble:   ((i % 3) - 1) * 18,
  }));
}

// ─── Rain ─────────────────────────────────────────────────────────────────────
function Rain({ heavy }) {
  const drops = makeDrops(heavy ? 80 : 40, heavy ? 1 : 0);
  const color = heavy ? 'rgba(140,180,230,0.65)' : 'rgba(160,195,240,0.50)';
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none', overflow: 'hidden' }}>
      {drops.map(d => (
        <motion.div
          key={d.id}
          animate={{ y: ['-10px', '650px'] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: `${d.left}%`, top: '-2%',
            width: d.width, height: d.height,
            background: `linear-gradient(180deg, transparent, ${color})`,
            borderRadius: 2,
            opacity: d.opacity,
            transform: 'rotate(10deg)',
          }}
        />
      ))}
      {/* Puddle shimmer at bottom */}
      <motion.div
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '12%',
          background: 'linear-gradient(180deg, transparent, rgba(140,180,230,0.22))',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// ─── Drizzle ──────────────────────────────────────────────────────────────────
function Drizzle() {
  const drops = makeDrops(22, 2);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none', overflow: 'hidden' }}>
      {drops.map(d => (
        <motion.div
          key={d.id}
          animate={{ y: ['-10px', '650px'] }}
          transition={{ duration: d.duration * 1.8, delay: d.delay * 1.4, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: `${d.left}%`, top: '-2%',
            width: 1, height: 5,
            background: 'rgba(170,205,245,0.45)',
            borderRadius: 2,
            opacity: d.opacity * 0.7,
          }}
        />
      ))}
    </div>
  );
}

// ─── Snow ─────────────────────────────────────────────────────────────────────
function Snow() {
  const flakes = makeFlakes(45);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none', overflow: 'hidden' }}>
      {flakes.map(f => (
        <motion.div
          key={f.id}
          animate={{
            y: ['-10px', '650px'],
            x: [0, f.wobble, -f.wobble / 2, f.wobble / 3, 0],
          }}
          transition={{
            y: { duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: f.duration * 0.7, delay: f.delay, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            position: 'absolute',
            left: `${f.left}%`, top: '-3%',
            width: f.size, height: f.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(220,235,255,0.7))',
            boxShadow: '0 0 4px rgba(200,220,255,0.5)',
            opacity: 0.75,
          }}
        />
      ))}
      {/* Snow accumulation at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '6%',
        background: 'linear-gradient(180deg, transparent, rgba(240,248,255,0.35))',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─── Fog ──────────────────────────────────────────────────────────────────────
function Fog() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 11, pointerEvents: 'none' }}>
      {/* Three drifting fog layers at different depths */}
      {[
        { top: '18%',  delay: 0,   duration: 18, opacity: 0.22, direction: 1  },
        { top: '40%',  delay: 3,   duration: 22, opacity: 0.28, direction: -1 },
        { top: '58%',  delay: 7,   duration: 15, opacity: 0.20, direction: 1  },
      ].map((layer, i) => (
        <motion.div
          key={i}
          animate={{ x: [`${-8 * layer.direction}%`, `${8 * layer.direction}%`] }}
          transition={{ duration: layer.duration, delay: layer.delay, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: layer.top, left: '-10%', right: '-10%', height: '20%',
            background: 'linear-gradient(180deg, transparent, rgba(220,225,230,0.7), transparent)',
            opacity: layer.opacity,
          }}
        />
      ))}
      {/* Overall haze */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(210,215,220,0.12)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─── Thunderstorm (rain + lightning flash) ────────────────────────────────────
function Thunderstorm() {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    // Random lightning: fires every 4–12 seconds
    let timeout;
    function schedule() {
      timeout = setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
        // Sometimes a quick double-flash
        setTimeout(() => {
          setFlash(true);
          setTimeout(() => setFlash(false), 60);
        }, 140);
        schedule();
      }, 4000 + Math.random() * 8000);
    }
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Rain heavy />
      {/* Lightning flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.06 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none',
              background: 'rgba(220,230,255,1)',
            }}
          />
        )}
      </AnimatePresence>
      {/* Storm cloud darkening */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
        background: 'rgba(30,40,70,0.18)',
      }} />
    </>
  );
}

// ─── Cloudy haze ──────────────────────────────────────────────────────────────
function CloudHaze({ light, isNight }) {
  // Use a flat gray for day, but a rich, dark translucent blue for night
  const dayHaze = light ? 'rgba(200,210,220,0.06)' : 'rgba(160,170,185,0.14)';
  const nightHaze = light ? 'rgba(40,50,90,0.15)' : 'rgba(20,30,60,0.3)';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
      background: isNight ? nightHaze : dayHaze,
      // 'overlay' keeps the glowing lights vivid while deepening the darks
      mixBlendMode: isNight ? 'overlay' : 'normal', 
    }} />
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
function WeatherEffects({ condition, isNight }) {
  if (!condition || condition === 'clear') return null;

  return (
    <AnimatePresence>
      <motion.div
        key={condition}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}
      >
        {condition === 'drizzle'      && <Drizzle />}
        {condition === 'rain'         && <Rain />}
        {condition === 'heavy-rain'   && <Rain heavy />}
        {condition === 'snow'         && <Snow />}
        {condition === 'fog'          && <Fog />}
        {condition === 'thunderstorm' && <Thunderstorm />}
        {condition === 'cloudy'       && <CloudHaze isNight={isNight} />}
        {condition === 'partly-cloudy'&& <CloudHaze light isNight={isNight} />}
      </motion.div>
    </AnimatePresence>
  );
}

export default WeatherEffects;