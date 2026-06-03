import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowerSVG } from './FlowerSVG.jsx';

// Individual grass blade
function GrassBlade({ x, height, color, delay, width = 3 }) {
  return (
    <motion.div
      animate={{ skewX: [0, 3, -2, 1, 0] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute',
        bottom: 0,
        left: `${x}%`,
        width: width,
        height: height,
        background: `linear-gradient(to top, ${color}, ${color}88)`,
        borderRadius: '50% 50% 0 0',
        transformOrigin: 'bottom center',
      }}
    />
  );
}

// Decorative bee
function Bee({ startX, startY, delay }) {
  return (
    <motion.div
      animate={{
        x: [0, 40, 70, 30, 0],
        y: [0, -20, 10, -15, 0],
      }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        fontSize: 13,
        zIndex: 4,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
      }}
    >
      🐝
    </motion.div>
  );
}

// Firefly / sparkle
function Firefly({ x, y, delay }) {
  return (
    <motion.div
      animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: '#ffe87a',
        boxShadow: '0 0 8px 3px rgba(255,232,80,0.6)',
        zIndex: 4,
        pointerEvents: 'none',
      }}
    />
  );
}

// Birds in sky
function Bird({ x, y, delay }) {
  return (
    <motion.div
      animate={{ x: [0, 60, 120], opacity: [0, 1, 0] }}
      transition={{ duration: 14, repeat: Infinity, delay, ease: 'linear' }}
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 2, pointerEvents: 'none', fontSize: 11, opacity: 0.7 }}
    >
      🐦
    </motion.div>
  );
}

// Rich garden background
function GardenBackground() {
  // Generate grass blades deterministically
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
    { x: 5, y: 5, w: 110, h: 40, o: 0.88, speed: 12 },
    { x: 38, y: 3, w: 80, h: 30, o: 0.65, speed: 18 },
    { x: 65, y: 7, w: 130, h: 50, o: 0.75, speed: 14 },
    { x: 80, y: 2, w: 70, h: 28, o: 0.55, speed: 20 },
  ];

  return (
    <>
      {/* Deep sky gradient — golden hour */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient(
            180deg,
            #2d6fa8 0%,
            #4a9fd4 15%,
            #87c5e8 28%,
            #c8e8f5 38%,
            #f5dfc2 50%,
            #e8c490 54%,
            #c8935a 58%,
            #9c6840 62%,
            #7a5030 68%,
            #5c3a22 78%,
            #3e2514 100%
          )
        `,
        zIndex: 0,
      }} />

      {/* Horizon glow */}
      <div style={{
        position: 'absolute',
        bottom: '35%', left: 0, right: 0,
        height: '22%',
        background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,180,80,0.35) 0%, transparent 100%)',
        zIndex: 1,
      }} />

      {/* Sun with rays */}
      <div style={{
        position: 'absolute', top: '6%', right: '10%',
        width: 54, height: 54,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, #fff8d0, #ffe060 50%, #ffb830)',
        boxShadow: '0 0 0 8px rgba(255,220,80,0.18), 0 0 0 18px rgba(255,200,60,0.1), 0 0 60px rgba(255,200,50,0.5)',
        zIndex: 2,
      }} />
      {/* Sun shimmer ring */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: 'calc(6% - 8px)', right: 'calc(10% - 8px)',
          width: 70, height: 70,
          borderRadius: '50%',
          border: '2px solid rgba(255,220,80,0.5)',
          zIndex: 2,
        }}
      />

      {/* Birds */}
      <Bird x={12} y={12} delay={0} />
      <Bird x={22} y={8} delay={5} />
      <Bird x={8} y={18} delay={9} />

      {/* Clouds with realistic shape */}
      {clouds.map((c, i) => (
        <motion.div key={i}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: c.speed, repeat: Infinity, ease: 'easeInOut', delay: i * 2.5 }}
          style={{
            position: 'absolute', top: `${c.y}%`, left: `${c.x}%`,
            zIndex: 1, opacity: c.o,
          }}
        >
          {/* Main puff */}
          <div style={{
            position: 'relative', width: c.w, height: c.h,
            background: `radial-gradient(ellipse at 50% 70%, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.8) 100%)`,
            borderRadius: 100,
            boxShadow: `inset 0 -6px 12px rgba(180,210,240,0.4), 0 4px 20px rgba(100,150,200,0.15)`,
          }}>
            <div style={{
              position: 'absolute', top: -(c.h * 0.4), left: c.w * 0.2,
              width: c.h * 1.1, height: c.h * 1.0,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 40%, white 0%, rgba(240,248,255,0.9) 100%)',
            }} />
            <div style={{
              position: 'absolute', top: -(c.h * 0.25), left: c.w * 0.5,
              width: c.h * 0.9, height: c.h * 0.85,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 40%, white 0%, rgba(240,248,255,0.85) 100%)',
            }} />
          </div>
        </motion.div>
      ))}

      {/* Mid-ground hills */}
      <div style={{
        position: 'absolute', bottom: '30%', left: '-5%', right: '-5%',
        height: '18%', zIndex: 2,
        background: 'transparent',
      }}>
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
            <polygon points="0,2 5,18 -5,18" fill="#2d5c38" opacity="0.85" />
            <polygon points="0,0 4,14 -4,14" fill="#366644" opacity="0.9" />
          </g>
        ))}
      </svg>

      {/* Main grass area */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '42%',
        background: 'linear-gradient(180deg, #5aaa6e 0%, #4a8c5c 20%, #3a7048 50%, #7c5c3e 65%, #6b4228 80%, #4a2e18 100%)',
        zIndex: 3,
      }} />

      {/* Grass texture overlay */}
      <div style={{
        position: 'absolute', bottom: '28%', left: 0, right: 0,
        height: '15%',
        background: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(80,160,90,0.08) 8px, rgba(80,160,90,0.08) 9px)',
        zIndex: 4,
      }} />

      {/* Mid grass blades */}
      <div style={{ position: 'absolute', bottom: '36%', left: 0, right: 0, height: 30, zIndex: 4 }}>
        {midGrass.map((g, i) => (
          <GrassBlade key={i} {...g} />
        ))}
      </div>

      {/* Soil band */}
      <div style={{
        position: 'absolute', bottom: '10%', left: 0, right: 0,
        height: '10%',
        background: 'linear-gradient(180deg, #8b5e3c 0%, #6b4228 60%, #4a2e18 100%)',
        zIndex: 5,
      }} />

      {/* Soil texture */}
      <div style={{
        position: 'absolute', bottom: '10%', left: 0, right: 0,
        height: '10%',
        backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(160,100,50,0.3) 2px, transparent 2px), radial-gradient(circle at 70% 30%, rgba(100,60,20,0.2) 3px, transparent 3px)',
        backgroundSize: '24px 12px, 18px 18px',
        zIndex: 6,
      }} />

      {/* Front grass blades */}
      <div style={{ position: 'absolute', bottom: '18%', left: 0, right: 0, height: 36, zIndex: 6 }}>
        {frontGrass.map((g, i) => (
          <GrassBlade key={i} {...g} />
        ))}
      </div>

      

      {/* Wooden fence */}
      <div style={{
        position: 'absolute', top: 'calc(58% - 34px)', left: 0, right: 0,
        height: 34, zIndex: 5,
      }}>
        {/* Horizontal rails */}
        <div style={{
          position: 'absolute', top: 8, left: 0, right: 0, height: 6,
          background: 'linear-gradient(180deg, #d4a868 0%, #b88840 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }} />
        <div style={{
          position: 'absolute', top: 22, left: 0, right: 0, height: 5,
          background: 'linear-gradient(180deg, #c89850 0%, #a87830 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }} />
        {/* Picket posts */}
        {Array.from({ length: 28 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i / 27) * 100}%`,
            top: 0,
            width: 14,
            height: 34,
            marginLeft: -7,
            background: `linear-gradient(180deg, ${i % 3 === 0 ? '#e0b870' : i % 3 === 1 ? '#d4a858' : '#c89848'} 0%, #a87830 100%)`,
            borderRadius: '3px 3px 0 0',
            boxShadow: '1px 0 2px rgba(0,0,0,0.15)',
          }}>
            {/* Picket tip */}
            <div style={{
              position: 'absolute', top: -8, left: 0, right: 0,
              height: 10,
              background: 'inherit',
              clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
            }} />
          </div>
        ))}
      </div>

      {/* Flower bed borders */}
      <div style={{
        position: 'absolute', bottom: '20%', left: '5%',
        width: '18%', height: 12,
        borderRadius: 6,
        background: 'linear-gradient(180deg, #8b5e3c 0%, #6b4228 100%)',
        border: '2px solid rgba(160,110,60,0.5)',
        zIndex: 5,
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '5%',
        width: '18%', height: 12,
        borderRadius: 6,
        background: 'linear-gradient(180deg, #8b5e3c 0%, #6b4228 100%)',
        border: '2px solid rgba(160,110,60,0.5)',
        zIndex: 5,
      }} />

      {/* Bees */}
      <Bee startX={25} startY={38} delay={0} />
      <Bee startX={60} startY={42} delay={3} />
      <Bee startX={45} startY={35} delay={1.5} />

      {/* Fireflies / sparkles */}
      <Firefly x={20} y={55} delay={0.5} />
      <Firefly x={55} y={60} delay={1.8} />
      <Firefly x={35} y={52} delay={3.2} />
      <Firefly x={72} y={58} delay={0.9} />
      <Firefly x={80} y={63} delay={2.4} />

      {/* Ambient light overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 40% at 88% 8%, rgba(255,220,100,0.12) 0%, transparent 70%)',
        zIndex: 7,
        pointerEvents: 'none',
      }} />
    </>
  );
}

function GardenCanvas({ flowers, selectedAvatar, plantingMode, onPlantAt, onFlowerClick, avatarPositions }) {
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

  const PLANT_Y_MIN = 49; // just above fence base — full grass area is plantable
  const PLANT_Y_MAX = 79; // above the bottom soil edge

  const handleClick = (e) => {
    if (!plantingMode) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (y > PLANT_Y_MIN && y < PLANT_Y_MAX) {
      onPlantAt({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    if (!plantingMode) { setHoverPos(null); return; }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPos(y > PLANT_Y_MIN && y < PLANT_Y_MAX ? { x, y } : null);
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
      <GardenBackground />

      {/* Planting zone overlays */}
      {plantingMode && (
        <>
          {/* Sky area — greyed out, not plantable */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '52%',
            background: 'rgba(30,20,10,0.28)',
            zIndex: 9, pointerEvents: 'none',
            borderBottom: '2px dashed rgba(255,200,100,0.5)',
          }} />
          {/* "🚫" label */}
          <div style={{
            position: 'absolute', top: '22%', left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,230,180,0.75)',
            fontSize: 12, fontWeight: 700, letterSpacing: 1,
            zIndex: 10, pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            🚫 Can't plant here
          </div>
          {/* Soil bottom — also not plantable */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '12%',
            background: 'rgba(30,20,10,0.22)',
            zIndex: 9, pointerEvents: 'none',
            borderTop: '2px dashed rgba(255,200,100,0.4)',
          }} />
          {/* Garden zone glow border */}
          <div style={{
            position: 'absolute', top: '52%', left: 0, right: 0,
            height: '36%',
            border: '2px solid rgba(100,220,120,0.35)',
            boxShadow: 'inset 0 0 20px rgba(80,200,100,0.08)',
            zIndex: 9, pointerEvents: 'none',
          }} />
        </>
      )}

      {/* Planting hint */}
      {plantingMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(244,160,181,0.95), rgba(232,138,160,0.95))',
            color: 'white',
            padding: '7px 20px', borderRadius: 22, fontSize: 13, fontWeight: 700,
            zIndex: 20, pointerEvents: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(244,100,130,0.4)',
            letterSpacing: 0.3,
          }}
        >
          🌱 Click in the garden area to plant!
        </motion.div>
      )}

      {/* Hover ghost flower */}
      {hoverPos && plantingMode && (
        <motion.div
          animate={{ scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{
            position: 'absolute',
            left: `${hoverPos.x}%`, top: `${hoverPos.y}%`,
            transform: 'translate(-50%, -80%)',
            opacity: 0.45, pointerEvents: 'none', zIndex: 10,
            filter: 'drop-shadow(0 4px 8px rgba(244,100,130,0.4))',
          }}
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
          style={{
            position: 'absolute',
            left: `${flower.x}%`, top: `${flower.y}%`,
            transform: 'translate(-50%, -80%)',
            cursor: 'pointer', zIndex: 8,
          }}
        >
          <motion.div
            whileHover={{ scale: 1.25, y: -6 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ y: { duration: 2.5 + (flower.id.charCodeAt(0) % 10) * 0.3, repeat: Infinity, ease: 'easeInOut' } }}
            style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.18))' }}
          >
            <FlowerSVG type={flower.flowerType} size={54} bloom={flower.bloom ?? 2} />
          </motion.div>
          {/* Small planted-by label on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(61,44,30,0.75)', color: 'white',
              fontSize: 9, padding: '2px 7px', borderRadius: 8, whiteSpace: 'nowrap',
              backdropFilter: 'blur(4px)',
            }}
          >
            {flower.plantedBy}
          </motion.div>
        </motion.div>
      ))}

      {/* Avatars */}
      {avatarPositions}
    </div>
  );
}

export default GardenCanvas;