import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowerSVG } from './FlowerSVG.jsx';

// Decorative background elements
function GardenBackground() {
  // Deterministic decorations from seed
  const clouds = [
    { x: 8, y: 6, w: 80, o: 0.7 },
    { x: 55, y: 4, w: 100, o: 0.5 },
    { x: 75, y: 9, w: 60, o: 0.6 },
  ];
  const butterflies = [
    { x: 20, y: 25, delay: 0 },
    { x: 70, y: 35, delay: 1.5 },
    { x: 45, y: 20, delay: 0.8 },
  ];

  return (
    <>
      {/* Sky gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #e8f4fc 0%, #f5e8d8 55%, #c8a870 56%, #8b5e3c 70%, #6b4228 100%)',
        zIndex: 0
      }} />

      {/* Sun */}
      <div style={{
        position: 'absolute', top: '5%', right: '8%',
        width: 60, height: 60, borderRadius: '50%',
        background: 'radial-gradient(circle, #fff7c0, #f7d76a)',
        boxShadow: '0 0 30px rgba(247,215,106,0.6), 0 0 60px rgba(247,215,106,0.3)',
        zIndex: 1
      }} />

      {/* Clouds */}
      {clouds.map((c, i) => (
        <motion.div key={i}
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: `${c.y}%`, left: `${c.x}%`,
            width: c.w, height: c.w * 0.45,
            background: 'white', borderRadius: 100,
            opacity: c.o, zIndex: 1,
            boxShadow: `${c.w * 0.2}px 0 0 ${c.w * 0.1}px white, ${c.w * 0.45}px ${-c.w * 0.1}px 0 ${c.w * 0.05}px white`
          }} />
      ))}

      {/* Butterflies */}
      {butterflies.map((b, i) => (
        <motion.div key={i}
          animate={{
            x: [0, 30, 60, 30, 0],
            y: [0, -15, 5, -10, 0],
          }}
          transition={{ duration: 7 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
          style={{ position: 'absolute', top: `${b.y}%`, left: `${b.x}%`, fontSize: 18, zIndex: 2, pointerEvents: 'none' }}
        >🦋</motion.div>
      ))}

      {/* Grass texture layer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '48%',
        background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(90,158,111,0.04) 40px, rgba(90,158,111,0.04) 41px)',
        zIndex: 1
      }} />

      {/* Soil band */}
      <div style={{
        position: 'absolute', bottom: '10%', left: 0, right: 0,
        height: '8%',
        background: 'linear-gradient(180deg, #8b5e3c 0%, #6b4228 100%)',
        zIndex: 2
      }} />

      {/* Path / stepping stones */}
      {[15, 30, 45, 60, 75].map((l, i) => (
        <div key={i} style={{
          position: 'absolute', bottom: '10%', left: `${l}%`,
          width: 40, height: 24, borderRadius: 12,
          background: 'rgba(200,170,130,0.5)',
          border: '1px solid rgba(160,120,80,0.3)',
          zIndex: 3
        }} />
      ))}

      {/* Fence */}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: 28, zIndex: 3,
        background: 'repeating-linear-gradient(90deg, #c8a870 0, #c8a870 12px, transparent 12px, transparent 36px)',
        borderTop: '4px solid #b89050'
      }} />
    </>
  );
}

function GardenCanvas({ flowers, selectedAvatar, plantingMode, onPlantAt, onFlowerClick, avatarPositions }) {
  const canvasRef = useRef();
  const [hoverPos, setHoverPos] = useState(null);
  const [newFlowerIds, setNewFlowerIds] = useState(new Set());

  // Track newly added flowers for bloom animation
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

  const handleClick = (e) => {
    if (!plantingMode) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    // Only plant in garden area (not sky)
    if (y > 20 && y < 92) {
      onPlantAt({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    if (!plantingMode) { setHoverPos(null); return; }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPos(y > 20 && y < 92 ? { x, y } : null);
  };

  return (
    <div
      ref={canvasRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPos(null)}
      style={{
        position: 'relative', width: '100%', paddingBottom: '55%',
        borderRadius: 24, overflow: 'hidden',
        cursor: plantingMode ? 'crosshair' : 'default',
        boxShadow: '0 8px 40px rgba(61,44,30,0.2)',
        border: '2px solid rgba(200,160,100,0.3)'
      }}
    >
      <GardenBackground />

      {/* Planting hint overlay */}
      {plantingMode && (
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(244,160,181,0.9)', color: 'white',
          padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600,
          zIndex: 20, pointerEvents: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 4px 15px rgba(244,100,130,0.3)'
        }}>
          🌱 Click anywhere in the garden to plant!
        </div>
      )}

      {/* Hover cursor flower */}
      {hoverPos && plantingMode && (
        <div style={{
          position: 'absolute',
          left: `${hoverPos.x}%`, top: `${hoverPos.y}%`,
          transform: 'translate(-50%, -80%)',
          opacity: 0.5, pointerEvents: 'none', zIndex: 10
        }}>
          <FlowerSVG type="rose" size={50} bloom={2} />
        </div>
      )}

      {/* Flowers */}
      {flowers.map((flower) => {
        const isNew = newFlowerIds.has && false; // simplified
        return (
          <motion.div
            key={flower.id}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            onClick={(e) => { e.stopPropagation(); onFlowerClick(flower); }}
            style={{
              position: 'absolute',
              left: `${flower.x}%`, top: `${flower.y}%`,
              transform: 'translate(-50%, -80%)',
              cursor: 'pointer', zIndex: 5
            }}
          >
            <motion.div
              whileHover={{ scale: 1.2, y: -5 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ y: { duration: 2 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' } }}
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
            >
              <FlowerSVG type={flower.flowerType} size={52} bloom={flower.bloom ?? 2} />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Avatars */}
      {avatarPositions}
    </div>
  );
}

export default GardenCanvas;
