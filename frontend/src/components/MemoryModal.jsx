import { motion, AnimatePresence } from 'framer-motion';
import { FlowerSVG, FLOWER_TYPES } from './FlowerSVG.jsx';
import { useState } from 'react';

function MemoryModal({ flower, onClose, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!flower) return null;

  const flowerInfo = FLOWER_TYPES.find(f => f.id === flower.flowerType) || FLOWER_TYPES[0];
  const formattedDate = flower.date
    ? new Date(flower.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown date';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(61,44,30,0.45)',
          backdropFilter: 'blur(5px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}
      >
        <motion.div
          initial={{ scale: 0.7, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.7, y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'linear-gradient(160deg, #fffaf5 0%, #fdf0e8 100%)',
            borderRadius: 28, width: '100%', maxWidth: 460,
            boxShadow: '0 24px 70px rgba(61,44,30,0.3)',
            border: '1px solid rgba(244,160,181,0.4)',
            overflow: 'hidden'
          }}
        >
          {/* Flower header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(244,160,181,0.15), rgba(247,215,106,0.15))',
            padding: '28px 28px 20px',
            borderBottom: '1px solid rgba(160,120,80,0.1)',
            display: 'flex', alignItems: 'center', gap: 16
          }}>
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <FlowerSVG type={flower.flowerType} size={80} bloom={2} animate />
            </motion.div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 2,
                color: 'var(--petal-pink)', textTransform: 'uppercase', marginBottom: 4
              }}>
                {flowerInfo.name} Memory
              </div>
              <h2 style={{ fontSize: 20, color: 'var(--text-dark)', margin: '0 0 4px' }}>
                {formattedDate}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: 12, color: 'var(--text-light)',
                  background: 'rgba(244,160,181,0.2)',
                  padding: '2px 10px', borderRadius: 20, fontWeight: 600
                }}>
                  🌿 Planted by {flower.plantedBy}
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(160,120,80,0.1)', border: 'none',
              width: 32, height: 32, borderRadius: '50%',
              fontSize: 16, color: 'var(--text-light)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>×</button>
          </div>

          {/* Photo */}
          {flower.photo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                maxHeight: '45vh', // Caps the photo container at 45% of the screen height
                overflowY: 'auto', // Turns on the vertical scrollbar if the photo is longer than the container
                backgroundColor: 'rgba(0,0,0,0.02)', // Subtle background for the scroll area
                borderBottom: '1px solid rgba(160,120,80,0.1)' // Soft divider line
              }}
            >
              <img
                src={flower.photo}
                alt="Memory"
                style={{ 
                  width: '100%', 
                  height: 'auto', // Allows the image to drop down to its full natural height
                  display: 'block' 
                }}
              />
            </motion.div>
          )}

          {/* Message */}
          <div style={{ padding: '20px 28px 24px' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                background: 'rgba(255,250,245,0.9)',
                border: '1px solid rgba(160,120,80,0.15)',
                borderRadius: 16, padding: '16px 18px',
                fontSize: 15, lineHeight: 1.7,
                color: 'var(--text-dark)',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: 32, color: 'rgba(244,160,181,0.4)', position: 'absolute', top: 8, left: 12, lineHeight: 1 }}>"</span>
              <div style={{ paddingLeft: 20 }}>{flower.message}</div>
              <span style={{ fontSize: 32, color: 'rgba(244,160,181,0.4)', position: 'absolute', bottom: 4, right: 14, lineHeight: 1 }}>"</span>
            </motion.div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={onClose} style={{
                flex: 1, padding: '11px 0',
                background: 'linear-gradient(135deg, rgba(244,160,181,0.2), rgba(247,215,106,0.2))',
                color: 'var(--text-mid)', border: '1.5px solid rgba(244,160,181,0.4)',
                borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}>
                Close 🌸
              </button>
              {confirmDelete ? (
                <button onClick={() => onDelete(flower.id)} style={{
                  flex: 1, padding: '11px 0',
                  background: '#e86a6a', color: 'white',
                  border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer'
                }}>
                  Confirm Delete 🗑️
                </button>
              ) : (
                <button onClick={() => setConfirmDelete(true)} style={{
                  padding: '11px 16px',
                  background: 'rgba(232,106,106,0.1)', color: '#c85050',
                  border: '1.5px solid rgba(232,106,106,0.2)',
                  borderRadius: 12, fontSize: 13, cursor: 'pointer'
                }}>
                  🗑️
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MemoryModal;
