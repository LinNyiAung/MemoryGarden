import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLOWER_TYPES, FlowerSVG } from './FlowerSVG.jsx';

function PlantModal({ position, planter, onPlant, onClose }) {
  const [step, setStep] = useState(1); // 1=type, 2=memory
  const [selectedType, setSelectedType] = useState('rose');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await onPlant({
        x: position.x,
        y: position.y,
        plantedBy: planter,
        message,
        date,
        flowerType: selectedType,
        bloom: 2
      }, photo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(61,44,30,0.4)',
          backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #fffaf5 0%, #fdf0e8 100%)',
            borderRadius: 24, padding: 32, width: '100%', maxWidth: 480,
            boxShadow: '0 20px 60px rgba(61,44,30,0.25)',
            border: '1px solid rgba(160,120,80,0.2)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ fontSize: 28 }}>🌱</div>
            <div>
              <h2 style={{ fontSize: 22, color: 'var(--text-dark)', margin: 0 }}>Plant a Memory</h2>
              <p style={{ fontSize: 13, color: 'var(--text-light)', margin: 0 }}>
                Planting as <strong style={{ color: 'var(--text-mid)' }}>{planter}</strong>
              </p>
            </div>
            <button onClick={onClose} style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              fontSize: 20, color: 'var(--text-light)', lineHeight: 1, padding: 4
            }}>×</button>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: s <= step ? 'var(--petal-pink)' : 'rgba(160,120,80,0.2)',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <p style={{ fontSize: 14, color: 'var(--text-mid)', marginBottom: 16 }}>Choose your flower type:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {FLOWER_TYPES.map(ft => (
                  <button key={ft.id} onClick={() => setSelectedType(ft.id)} style={{
                    background: selectedType === ft.id ? 'rgba(244,160,181,0.2)' : 'rgba(255,255,255,0.6)',
                    border: `2px solid ${selectedType === ft.id ? 'var(--petal-pink)' : 'rgba(160,120,80,0.15)'}`,
                    borderRadius: 14, padding: '10px 6px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ pointerEvents: 'none' }}>
                      <FlowerSVG type={ft.id} size={50} bloom={2} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-mid)', fontWeight: 500 }}>{ft.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} style={{
                marginTop: 20, width: '100%', padding: '12px 0',
                background: 'linear-gradient(135deg, #f4a0b5, #e88aa0)',
                color: 'white', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 600, letterSpacing: 0.5,
                boxShadow: '0 4px 15px rgba(244,100,130,0.3)'
              }}>Next →</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-mid)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  📅 When is this memory from?
                </label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: '1.5px solid rgba(160,120,80,0.25)', background: 'rgba(255,255,255,0.8)',
                  color: 'var(--text-dark)', fontSize: 14, outline: 'none'
                }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-mid)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  💌 Write your memory *
                </label>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Tell the story of this memory... what happened, how you felt, what made it special ✨"
                  rows={4} style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1.5px solid rgba(160,120,80,0.25)', background: 'rgba(255,255,255,0.8)',
                    color: 'var(--text-dark)', fontSize: 14, outline: 'none',
                    resize: 'vertical', lineHeight: 1.6
                  }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-mid)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  📸 Add a photo (optional)
                </label>
                {photoPreview ? (
                  <div style={{ position: 'relative' }}>
                    <img src={photoPreview} style={{
                      width: '100%', height: 140, objectFit: 'cover', borderRadius: 10
                    }} />
                    <button onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                      style={{
                        position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)',
                        color: 'white', border: 'none', borderRadius: 50, width: 28, height: 28,
                        fontSize: 16, lineHeight: '28px', textAlign: 'center'
                      }}>×</button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current.click()} style={{
                    width: '100%', padding: '14px 0', borderRadius: 10,
                    border: '2px dashed rgba(160,120,80,0.3)', background: 'rgba(255,255,255,0.6)',
                    color: 'var(--text-light)', fontSize: 13, cursor: 'pointer'
                  }}>
                    + Click to add a photo
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, padding: '12px 0', background: 'rgba(160,120,80,0.1)',
                  color: 'var(--text-mid)', border: '1.5px solid rgba(160,120,80,0.2)',
                  borderRadius: 12, fontSize: 14, fontWeight: 500
                }}>← Back</button>
                <button onClick={handleSubmit} disabled={!message.trim() || loading} style={{
                  flex: 2, padding: '12px 0',
                  background: message.trim() ? 'linear-gradient(135deg, #f4a0b5, #e88aa0)' : 'rgba(200,180,170,0.4)',
                  color: 'white', border: 'none', borderRadius: 12,
                  fontSize: 15, fontWeight: 600,
                  boxShadow: message.trim() ? '0 4px 15px rgba(244,100,130,0.3)' : 'none',
                  cursor: message.trim() ? 'pointer' : 'not-allowed'
                }}>
                  {loading ? '🌱 Planting...' : '🌸 Plant Memory'}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PlantModal;
