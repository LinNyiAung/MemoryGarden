import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowerSVG } from './FlowerSVG.jsx';

// ─── Small scene helpers ──────────────────────────────────────────────────────

function GrassBlade({ x, height, color, delay, width = 3 }) {
  return (
    <motion.div
      animate={{ skewX: [0, 3, -2, 1, 0] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', bottom: 0, left: `${x}%`,
        width, height,
        background: `linear-gradient(to top, ${color}, ${color}88)`,
        borderRadius: '50% 50% 0 0',
        transformOrigin: 'bottom center',
      }}
    />
  );
}

function Bee({ startX, startY, delay }) {
  return (
    <motion.div
      animate={{ x: [0, 40, 70, 30, 0], y: [0, -20, 10, -15, 0] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', left: `${startX}%`, top: `${startY}%`,
        fontSize: 13, zIndex: 4, pointerEvents: 'none',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
      }}
    >🐝</motion.div>
  );
}

function Firefly({ x, y, delay }) {
  return (
    <motion.div
      animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeInOut' }}
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        width: 5, height: 5, borderRadius: '50%',
        background: '#ffe87a',
        boxShadow: '0 0 8px 3px rgba(255,232,80,0.6)',
        zIndex: 4, pointerEvents: 'none',
      }}
    />
  );
}

function Bird({ x, y, delay }) {
  return (
    <motion.div
      animate={{ x: [0, 60, 120], opacity: [0, 1, 0] }}
      transition={{ duration: 14, repeat: Infinity, delay, ease: 'linear' }}
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 2, pointerEvents: 'none', fontSize: 11, opacity: 0.7 }}
    >🐦</motion.div>
  );
}

// Twinkling star
function Star({ x, y, size, delay }) {
  return (
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        width: size, height: size, borderRadius: '50%',
        background: 'white',
        boxShadow: `0 0 ${size * 2}px ${size}px rgba(255,255,255,0.4)`,
        zIndex: 2, pointerEvents: 'none',
      }}
    />
  );
}

// Moon
function Moon({ pos }) {
  const top  = pos?.top  ?? '8%';
  const right = pos?.right ?? '14%';
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 2, ease: 'easeOut' }}
      style={{
        position: 'absolute', top, right,
        width: 46, height: 46, borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 38%, #fffce0, #f5e890 55%, #d4c870)',
        boxShadow: '0 0 0 6px rgba(255,240,100,0.1), 0 0 30px rgba(255,240,100,0.25), 0 0 60px rgba(255,240,100,0.1)',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      {/* craters */}
      <div style={{ position:'absolute', top:'22%', left:'55%', width:10, height:10, borderRadius:'50%', background:'rgba(180,170,80,0.45)' }} />
      <div style={{ position:'absolute', top:'55%', left:'20%', width:7,  height:7,  borderRadius:'50%', background:'rgba(180,170,80,0.35)' }} />
      <div style={{ position:'absolute', top:'35%', left:'30%', width:5,  height:5,  borderRadius:'50%', background:'rgba(180,170,80,0.3)'  }} />
    </motion.div>
  );
}

// ─── Stars field (generated deterministically) ────────────────────────────────
const STARS = Array.from({ length: 55 }, (_, i) => ({
  x:     ((i * 37 + 13) % 97),
  y:     ((i * 53 + 7)  % 44),   // keep them in the top ~44% (sky area)
  size:  1 + (i % 3),
  delay: (i * 0.31) % 3,
}));

// ─── Rich garden background — driven by the `phase` prop ─────────────────────
function GardenBackground({ phase }) {
  const skyGradient = phase.skyColors
    .map((c, i, arr) => `${c} ${Math.round((i / (arr.length - 1)) * 100)}%`)
    .join(', ');

  const frontGrass = Array.from({ length: 38 }, (_, i) => ({
    x: (i / 38) * 100,
    height: 22 + ((i * 7) % 14),
    color: i % 3 === 0 ? '#4a9660' : i % 3 === 1 ? '#5cb870' : '#6dd880',
    delay: (i * 0.13) % 2.5,
    width: 2 + (i % 3),
  }));

  const midGrass = Array.from({ length: 28 }, (_, i) => ({
    x: (i / 28) * 100,
    height: 14 + ((i * 5) % 10),
    color: i % 2 === 0 ? '#3a7c50' : '#4a8c60',
    delay: (i * 0.17) % 2,
    width: 2,
  }));

  const clouds = [
    { x: 5,  y: 5, w: 110, h: 40, o: phase.cloudOpacity,       speed: 12 },
    { x: 38, y: 3, w: 80,  h: 30, o: phase.cloudOpacity * 0.7, speed: 18 },
    { x: 65, y: 7, w: 130, h: 50, o: phase.cloudOpacity * 0.8, speed: 14 },
    { x: 80, y: 2, w: 70,  h: 28, o: phase.cloudOpacity * 0.6, speed: 20 },
  ];

  return (
    <>
      {/* Sky */}
      <motion.div
        animate={{ background: `linear-gradient(180deg, ${skyGradient})` }}
        transition={{ duration: 4, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />

      {/* Horizon glow */}
      <motion.div
        animate={{ background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${phase.horizonGlow} 0%, transparent 100%)` }}
        transition={{ duration: 4, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '35%', left: 0, right: 0, height: '22%', zIndex: 1 }}
      />

      {/* ── STARS (night / dusk / dawn) ── */}
      <AnimatePresence>
        {phase.starsVisible && (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
          >
            {STARS.map((s, i) => <Star key={i} {...s} />)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOON ── */}
      <AnimatePresence>
        {phase.moonVisible && (
          <motion.div
            key="moon"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 2.5 }}
            style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
          >
            <Moon pos={phase.moonPos} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SUN ── */}
      <AnimatePresence>
        {phase.sunVisible && (
          <motion.div
            key="sun"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 2.5 }}
            style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
          >
            <div style={{
              position: 'absolute',
              ...phase.sunPos,
              width: 54, height: 54,
              borderRadius: '50%',
              background: `radial-gradient(circle at 40% 40%, ${phase.sunColors[0]}, ${phase.sunColors[1]} 50%, ${phase.sunColors[2]})`,
              boxShadow: `0 0 0 8px rgba(255,220,80,0.18), 0 0 0 18px rgba(255,200,60,0.1), 0 0 60px rgba(255,200,50,0.5)`,
            }} />
            {/* shimmer ring */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: phase.sunPos?.top ? `calc(${phase.sunPos.top} - 8px)` : undefined,
                bottom: phase.sunPos?.bottom ? `calc(${phase.sunPos.bottom} - 8px)` : undefined,
                left: phase.sunPos?.left ? `calc(${phase.sunPos.left} - 8px)` : undefined,
                right: phase.sunPos?.right ? `calc(${phase.sunPos.right} - 8px)` : undefined,
                width: 70, height: 70, borderRadius: '50%',
                border: '2px solid rgba(255,220,80,0.5)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Birds */}
      <AnimatePresence>
        {phase.birdsVisible && (
          <motion.div key="birds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
          >
            <Bird x={12} y={12} delay={0} />
            <Bird x={22} y={8}  delay={5} />
            <Bird x={8}  y={18} delay={9} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clouds */}
      {clouds.map((c, i) => (
        <motion.div key={i}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: c.speed, repeat: Infinity, ease: 'easeInOut', delay: i * 2.5 }}
          style={{ position: 'absolute', top: `${c.y}%`, left: `${c.x}%`, zIndex: 1, opacity: c.o,
            transition: 'opacity 3s ease' }}
        >
          <div style={{
            position: 'relative', width: c.w, height: c.h,
            background: phase.starsVisible
              ? `radial-gradient(ellipse at 50% 70%, rgba(180,190,220,0.6) 0%, rgba(140,160,210,0.3) 100%)`
              : `radial-gradient(ellipse at 50% 70%, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.8) 100%)`,
            borderRadius: 100,
            boxShadow: `inset 0 -6px 12px rgba(180,210,240,0.4), 0 4px 20px rgba(100,150,200,0.15)`,
          }}>
            <div style={{
              position: 'absolute', top: -(c.h * 0.4), left: c.w * 0.2,
              width: c.h * 1.1, height: c.h * 1.0, borderRadius: '50%',
              background: phase.starsVisible ? 'rgba(160,170,210,0.5)' : 'rgba(255,255,255,0.9)',
            }} />
            <div style={{
              position: 'absolute', top: -(c.h * 0.25), left: c.w * 0.5,
              width: c.h * 0.9, height: c.h * 0.85, borderRadius: '50%',
              background: phase.starsVisible ? 'rgba(150,160,200,0.45)' : 'rgba(255,255,255,0.85)',
            }} />
          </div>
        </motion.div>
      ))}

      {/* Mid-ground hills */}
      <div style={{ position: 'absolute', bottom: '30%', left: '-5%', right: '-5%', height: '18%', zIndex: 2 }}>
        <svg viewBox="0 0 110 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a8c60" />
              <stop offset="100%" stopColor="#3a6a48" />
            </linearGradient>
            <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a7c50" />
              <stop offset="100%" stopColor="#2e5e3c" />
            </linearGradient>
          </defs>
          <path d="M-5,20 Q15,4 30,10 Q48,16 60,6 Q72,0 85,8 Q98,14 115,6 L115,20 Z" fill="url(#hill2)" opacity="0.7" />
          <path d="M-5,20 Q10,8 25,12 Q42,18 55,9 Q68,3 80,11 Q94,16 115,8 L115,20 Z" fill="url(#hill1)" opacity="0.85" />
        </svg>
      </div>

      {/* Trees silhouette */}
      <svg viewBox="0 0 100 30" preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: '38%', left: 0, right: 0, width: '100%', height: '12%', zIndex: 2 }}>
        {[3, 8, 13, 88, 93, 97].map((x, i) => (
          <g key={i} transform={`translate(${x}, 0)`}>
            <rect x="-1" y="18" width="2" height="12" fill="#2a4a30" />
            <polygon points="0,2 5,18 -5,18"  fill="#2d5c38" opacity="0.85" />
            <polygon points="0,0 4,14 -4,14"  fill="#366644" opacity="0.9" />
          </g>
        ))}
      </svg>

      {/* ── NIGHT TINT over ground ── */}
      <AnimatePresence>
        {phase.grassTint && phase.grassTint !== 'rgba(0,0,0,0)' && (
          <motion.div
            key={`grass-tint-${phase.name}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '42%',
              background: phase.grassTint,
              zIndex: 10, pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Main grass */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '42%',
        background: 'linear-gradient(180deg, #5aaa6e 0%, #4a8c5c 20%, #3a7048 50%, #7c5c3e 65%, #6b4228 80%, #4a2e18 100%)',
        zIndex: 3,
      }} />

      {/* Grass texture */}
      <div style={{
        position: 'absolute', bottom: '28%', left: 0, right: 0, height: '15%',
        background: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(80,160,90,0.08) 8px, rgba(80,160,90,0.08) 9px)',
        zIndex: 4,
      }} />

      {/* Mid grass blades */}
      <div style={{ position: 'absolute', bottom: '36%', left: 0, right: 0, height: 30, zIndex: 4 }}>
        {midGrass.map((g, i) => <GrassBlade key={i} {...g} />)}
      </div>

      {/* Soil band */}
      <div style={{
        position: 'absolute', bottom: '10%', left: 0, right: 0, height: '10%',
        background: 'linear-gradient(180deg, #8b5e3c 0%, #6b4228 60%, #4a2e18 100%)',
        zIndex: 5,
      }} />

      {/* Soil texture */}
      <div style={{
        position: 'absolute', bottom: '10%', left: 0, right: 0, height: '10%',
        backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(160,100,50,0.3) 2px, transparent 2px), radial-gradient(circle at 70% 30%, rgba(100,60,20,0.2) 3px, transparent 3px)',
        backgroundSize: '24px 12px, 18px 18px',
        zIndex: 6,
      }} />

      {/* Front grass blades */}
      <div style={{ position: 'absolute', bottom: '18%', left: 0, right: 0, height: 36, zIndex: 6 }}>
        {frontGrass.map((g, i) => <GrassBlade key={i} {...g} />)}
      </div>

      {/* Wooden fence */}
      <div style={{ position: 'absolute', top: 'calc(58% - 34px)', left: 0, right: 0, height: 34, zIndex: 5 }}>
        <div style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 6, background: 'linear-gradient(180deg, #d4a868 0%, #b88840 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
        <div style={{ position: 'absolute', top: 22, left: 0, right: 0, height: 5, background: 'linear-gradient(180deg, #c89850 0%, #a87830 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
        {Array.from({ length: 28 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${(i / 27) * 100}%`, top: 0,
            width: 14, height: 34, marginLeft: -7,
            background: `linear-gradient(180deg, ${i % 3 === 0 ? '#e0b870' : i % 3 === 1 ? '#d4a858' : '#c89848'} 0%, #a87830 100%)`,
            borderRadius: '3px 3px 0 0', boxShadow: '1px 0 2px rgba(0,0,0,0.15)',
          }}>
            <div style={{ position: 'absolute', top: -8, left: 0, right: 0, height: 10, background: 'inherit', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />
          </div>
        ))}
      </div>

      {/* Flower bed borders */}
      <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: '18%', height: 12, borderRadius: 6, background: 'linear-gradient(180deg, #8b5e3c 0%, #6b4228 100%)', border: '2px solid rgba(160,110,60,0.5)', zIndex: 5 }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: '18%', height: 12, borderRadius: 6, background: 'linear-gradient(180deg, #8b5e3c 0%, #6b4228 100%)', border: '2px solid rgba(160,110,60,0.5)', zIndex: 5 }} />

      {/* Bees (daytime only) */}
      <AnimatePresence>
        {phase.beesVisible && (
          <motion.div key="bees" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}
          >
            <Bee startX={25} startY={38} delay={0} />
            <Bee startX={60} startY={42} delay={3} />
            <Bee startX={45} startY={35} delay={1.5} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fireflies (night / dusk) */}
      <AnimatePresence>
        {phase.firefliesVisible && (
          <motion.div key="fireflies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}
          >
            <Firefly x={20} y={55} delay={0.5} />
            <Firefly x={55} y={60} delay={1.8} />
            <Firefly x={35} y={52} delay={3.2} />
            <Firefly x={72} y={58} delay={0.9} />
            <Firefly x={80} y={63} delay={2.4} />
            <Firefly x={48} y={66} delay={1.2} />
            <Firefly x={15} y={62} delay={4.0} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient light overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 40% at 88% 8%, rgba(255,220,100,0.12) 0%, transparent 70%)',
        zIndex: 7, pointerEvents: 'none',
      }} />
    </>
  );
}

// ─── Main canvas ──────────────────────────────────────────────────────────────

function GardenCanvas({ flowers, selectedAvatar, plantingMode, onPlantAt, onFlowerClick, avatarPositions, phase }) {
  const canvasRef = useRef();
  const [hoverPos, setHoverPos] = useState(null);
  const [newFlowerIds, setNewFlowerIds] = useState(new Set());

  useEffect(() => {
    const ids = new Set(flowers.map(f => f.id));
    setNewFlowerIds(prev => {
      const newOnes = new Set([...ids].filter(id => !prev.has(id)));
      if (newOnes.size > 0) {
        setTimeout(() => setNewFlowerIds(ids), 2000);
        return ids;
      }
      return ids;
    });
  }, [flowers.length]);

  const PLANT_Y_MIN = 49;
  const PLANT_Y_MAX = 79;

  const handleClick = (e) => {
    if (!plantingMode) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (y > PLANT_Y_MIN && y < PLANT_Y_MAX) onPlantAt({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!plantingMode) { setHoverPos(null); return; }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPos(y > PLANT_Y_MIN && y < PLANT_Y_MAX ? { x, y } : null);
  };

  // Fallback phase for golden-hour look if parent doesn't pass phase yet
  const currentPhase = phase || {
    name: 'golden-hour',
    skyColors: ['#2d6fa8','#4a9fd4','#87c5e8','#c8e8f5','#f5dfc2','#e8c490','#c8935a','#9c6840'],
    horizonGlow: 'rgba(255,180,80,0.35)',
    sunVisible: true,
    sunPos: { top: '6%', right: '10%' },
    sunColors: ['#fff8d0','#ffe060','#ffb830'],
    moonVisible: false,
    starsVisible: false,
    firefliesVisible: false,
    birdsVisible: true,
    beesVisible: true,
    cloudOpacity: 0.88,
    grassTint: 'rgba(0,0,0,0)',
  };

  return (
    <div
      ref={canvasRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPos(null)}
      style={{
        position: 'relative', width: '100%', paddingBottom: '58%',
        borderRadius: 28, overflow: 'hidden',
        cursor: plantingMode ? 'crosshair' : 'default',
        boxShadow: '0 12px 50px rgba(61,44,30,0.28), 0 2px 8px rgba(61,44,30,0.15)',
        border: '2px solid rgba(200,160,100,0.35)',
      }}
    >
      <GardenBackground phase={currentPhase} />

      {/* Planting zone overlays */}
      {plantingMode && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '52%', background: 'rgba(30,20,10,0.28)', zIndex: 9, pointerEvents: 'none', borderBottom: '2px dashed rgba(255,200,100,0.5)' }} />
          <div style={{ position: 'absolute', top: '22%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,230,180,0.75)', fontSize: 12, fontWeight: 700, letterSpacing: 1, zIndex: 10, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            🚫 Can't plant here
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '12%', background: 'rgba(30,20,10,0.22)', zIndex: 9, pointerEvents: 'none', borderTop: '2px dashed rgba(255,200,100,0.4)' }} />
          <div style={{ position: 'absolute', top: '52%', left: 0, right: 0, height: '36%', border: '2px solid rgba(100,220,120,0.35)', boxShadow: 'inset 0 0 20px rgba(80,200,100,0.08)', zIndex: 9, pointerEvents: 'none' }} />
        </>
      )}

      {plantingMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, rgba(244,160,181,0.95), rgba(232,138,160,0.95))', color: 'white', padding: '7px 20px', borderRadius: 22, fontSize: 13, fontWeight: 700, zIndex: 20, pointerEvents: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(244,100,130,0.4)', letterSpacing: 0.3 }}
        >
          🌱 Click in the garden area to plant!
        </motion.div>
      )}

      {hoverPos && plantingMode && (
        <motion.div
          animate={{ scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ position: 'absolute', left: `${hoverPos.x}%`, top: `${hoverPos.y}%`, transform: 'translate(-50%, -80%)', opacity: 0.45, pointerEvents: 'none', zIndex: 10, filter: 'drop-shadow(0 4px 8px rgba(244,100,130,0.4))' }}
        >
          <FlowerSVG type="rose" size={52} bloom={2} />
        </motion.div>
      )}

      {/* Flowers */}
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          initial={{ scale: 0, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          onClick={(e) => { e.stopPropagation(); onFlowerClick(flower); }}
          style={{ position: 'absolute', left: `${flower.x}%`, top: `${flower.y}%`, transform: 'translate(-50%, -80%)', cursor: 'pointer', zIndex: 8 }}
        >
          <motion.div
            whileHover={{ scale: 1.25, y: -6 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ y: { duration: 2.5 + (flower.id.charCodeAt(0) % 10) * 0.3, repeat: Infinity, ease: 'easeInOut' } }}
            style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.18))' }}
          >
            <FlowerSVG type={flower.flowerType} size={54} bloom={flower.bloom ?? 2} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
            style={{ position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)', background: 'rgba(61,44,30,0.75)', color: 'white', fontSize: 9, padding: '2px 7px', borderRadius: 8, whiteSpace: 'nowrap', backdropFilter: 'blur(4px)' }}
          >
            {flower.plantedBy}
          </motion.div>
        </motion.div>
      ))}

      {avatarPositions}
    </div>
  );
}

export default GardenCanvas;