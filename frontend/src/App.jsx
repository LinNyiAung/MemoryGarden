import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './components/Avatar.jsx';
import GardenCanvas from './components/GardenCanvas.jsx';
import PlantModal from './components/PlantModal.jsx';
import MemoryModal from './components/MemoryModal.jsx';
import PinScreen from './components/PinScreen.jsx';
import { FlowerSVG } from './components/FlowerSVG.jsx';
import { getFlowers, getGarden, plantFlower, deleteFlower, updateGarden, uploadAvatar } from './api.js';
import { useDayNight } from './useDayNight.js';
import { useWeather } from './useWeather.js';
import WeatherBadge from './components/WeatherBadge.jsx';

// Hardcoded names
const NAMES = { him: 'Lin Nyi Aung', her: 'Htet Hsu Waddy' };

// ─── Falling petals — colour-shifts with time of day ─────────────────────────
function FallingPetals({ phase }) {
  // Night: fewer, dimmer petals; daytime: full show
  const isNight = phase.name === 'deep-night' || phase.name === 'night';
  const count = isNight ? 6 : 12;
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i / count) * 100 + ((i * 7) % 15),
    delay: (i * 0.7) % 8,
    duration: 6 + (i * 0.6) % 8,
    size: 8 + (i % 5) * 2,
    emoji: isNight
      ? ['✨', '⭐', '🌟', '💫'][i % 4]
      : ['🌸', '🌺', '🌼', '🌷'][i % 4],
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {petals.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.left}%`, top: '-5%',
          fontSize: p.size, opacity: isNight ? 0.35 : 0.6,
          animation: `petals-fall ${p.duration}s ${p.delay}s linear infinite`,
        }}>{p.emoji}</div>
      ))}
    </div>
  );
}

// ─── Time-of-day badge (top-right corner) ────────────────────────────────────
function DayNightBadge({ phase, timeString }) {
  return (
    <motion.div
      key={phase.name}
      initial={{ opacity: 0, y: -8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 16, right: 16, zIndex: 200,
        background: phase.starsVisible
          ? 'rgba(10,20,60,0.82)'
          : 'rgba(255,250,245,0.88)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${phase.starsVisible ? 'rgba(100,130,255,0.25)' : 'rgba(200,160,100,0.25)'}`,
        borderRadius: 24,
        padding: '7px 16px',
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: phase.starsVisible
          ? '0 4px 20px rgba(10,20,80,0.5)'
          : '0 4px 20px rgba(61,44,30,0.12)',
      }}
    >
      <span style={{ fontSize: 16 }}>{phase.label.split(' ')[0]}</span>
      <div>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
          color: phase.starsVisible ? 'rgba(180,200,255,0.9)' : 'var(--text-mid)',
        }}>
          {phase.label.split(' ').slice(1).join(' ')}
        </div>
        <div style={{
          fontSize: 13, fontWeight: 700,
          color: phase.starsVisible ? 'white' : 'var(--text-dark)',
          fontFamily: "'Lato', monospace",
          letterSpacing: 1,
        }}>
          {timeString}
        </div>
      </div>
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('garden_unlocked') === 'true'
  );
  const [flowers, setFlowers] = useState([]);
  const [garden, setGarden] = useState({ title: 'Our Memory Garden', himPhoto: null, herPhoto: null });
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [plantingMode, setPlantingMode] = useState(false);
  const [pendingPosition, setPendingPosition] = useState(null);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [toast, setToast] = useState(null);

  // ── Day/Night ──
  const { phase, timeString } = useDayNight();
  const isNight = phase.name === 'deep-night' || phase.name === 'night' || phase.name === 'dusk';

  // ── Weather Sync ──
  const { weather, loading: weatherLoading, error: weatherError, locationName, refresh: refreshWeather } = useWeather();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [f, g] = await Promise.all([getFlowers(), getGarden()]);
      setFlowers(f);
      setGarden(g);
      setTitleInput(g.title);
    } catch (e) {
      showToast('⚠️ Could not connect to the garden server. Is it running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAvatarClick = (who) => {
    setSelectedAvatar(selectedAvatar === who ? null : who);
    setPlantingMode(false);
  };

  const handlePlantButton = () => {
    if (!selectedAvatar) { showToast('💡 Click on your avatar first!'); return; }
    setPlantingMode(p => !p);
  };

  const handlePlantAt = (pos) => { setPendingPosition(pos); setPlantingMode(false); };

  const handlePlantConfirm = async (data, photo) => {
    try {
      const newFlower = await plantFlower(data, photo);
      setFlowers(prev => [...prev, newFlower]);
      setPendingPosition(null);
      showToast(`🌸 Memory planted by ${data.plantedBy}!`);
    } catch { showToast('❌ Failed to plant. Check the server!'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFlower(id);
      setFlowers(prev => prev.filter(f => f.id !== id));
      setSelectedFlower(null);
      showToast('🍂 Memory returned to the earth...');
    } catch { showToast('❌ Could not delete memory.'); }
  };

  const handleTitleSave = async () => {
    try {
      const updated = await updateGarden(titleInput);
      setGarden(updated);
      setEditingTitle(false);
    } catch { showToast('❌ Could not save title.'); }
  };

  const handleAvatarPhotoUpload = async (who, file) => {
    try {
      const updatedGarden = await uploadAvatar(who, file);
      setGarden(updatedGarden);
      showToast('📸 Photo updated successfully!');
    } catch { showToast('❌ Failed to upload photo.'); }
  };

  // ── Page background tint driven by time of day ──
  const pageBg = isNight
    ? `radial-gradient(ellipse 80% 50% at 20% 80%, rgba(20,30,80,0.3) 0%, transparent 60%),
       radial-gradient(ellipse 60% 40% at 80% 20%, rgba(30,20,80,0.2) 0%, transparent 60%),
       #0d1228`
    : phase.name === 'dawn' || phase.name === 'dusk' || phase.name === 'golden-hour'
      ? `radial-gradient(ellipse 80% 50% at 20% 80%, rgba(200,100,60,0.1) 0%, transparent 60%),
         radial-gradient(ellipse 60% 40% at 80% 20%, rgba(240,140,80,0.09) 0%, transparent 60%),
         #fef0e4`
      : `radial-gradient(ellipse 80% 50% at 20% 80%, rgba(200,160,100,0.08) 0%, transparent 60%),
         radial-gradient(ellipse 60% 40% at 80% 20%, rgba(244,160,181,0.07) 0%, transparent 60%),
         var(--sky)`;

  const textDarkOverride = isNight ? '#e8e0ff' : undefined;
  const textLightOverride = isNight ? 'rgba(180,190,255,0.7)' : undefined;

  const avatarElements = (
    <>
      <motion.div
        style={{ position: 'absolute', bottom: '10%', left: '12%', zIndex: 8 }}
        animate={{ x: plantingMode && selectedAvatar === 'him' ? [0, 5, -5, 0] : 0 }}
        transition={{ duration: 0.4 }}
      >
        <Avatar name={NAMES.him} color="#6ba3d4" isSelected={selectedAvatar === 'him'}
          expression={selectedAvatar === 'him' ? (plantingMode ? 'planting' : 'happy') : 'idle'}
          side="left" photo={garden.himPhoto}
          onPhotoChange={(file) => handleAvatarPhotoUpload('him', file)}
          onClick={() => handleAvatarClick('him')} />
      </motion.div>
      <motion.div
        style={{ position: 'absolute', bottom: '10%', right: '12%', zIndex: 8 }}
        animate={{ x: plantingMode && selectedAvatar === 'her' ? [0, -5, 5, 0] : 0 }}
        transition={{ duration: 0.4 }}
      >
        <Avatar name={NAMES.her} color="#e8a4c4" isSelected={selectedAvatar === 'her'}
          expression={selectedAvatar === 'her' ? (plantingMode ? 'planting' : 'excited') : 'idle'}
          side="right" photo={garden.herPhoto}
          onPhotoChange={(file) => handleAvatarPhotoUpload('her', file)}
          onClick={() => handleAvatarClick('her')} />
      </motion.div>
    </>
  );

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <PinScreen key="pin-screen" onUnlock={() => {
          localStorage.setItem('garden_unlocked', 'true');
          setIsAuthenticated(true);
        }} />
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      animate={{ background: pageBg }}
      transition={{ duration: 4, ease: 'easeInOut' }}
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      <FallingPetals phase={phase} />
      <DayNightBadge phase={phase} timeString={timeString} />
      <WeatherBadge
        weather={weather}
        locationName={locationName}
        loading={weatherLoading}
        error={weatherError}
        isNight={isNight}
        onRefresh={refreshWeather}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          {editingTitle ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <input value={titleInput} onChange={e => setTitleInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTitleSave()} autoFocus
                style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', textAlign: 'center', border: 'none', borderBottom: '2px solid var(--petal-pink)', background: 'transparent', color: textDarkOverride || 'var(--text-dark)', outline: 'none', width: 320 }} />
              <button onClick={handleTitleSave} style={{ background: 'var(--petal-pink)', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
            </div>
          ) : (
            <h1 onClick={() => setEditingTitle(true)} style={{
              fontSize: 'clamp(22px, 5vw, 36px)',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              color: textDarkOverride || 'var(--text-dark)',
              cursor: 'text', letterSpacing: 1,
              textShadow: isNight ? '0 2px 12px rgba(100,120,255,0.3)' : '0 2px 8px rgba(61,44,30,0.1)',
            }}>
              🌸 {garden.title}
            </h1>
          )}
          <p style={{ fontSize: 13, color: textLightOverride || 'var(--text-light)', marginTop: 4 }}>
            {flowers.length === 0 ? 'No memories yet — plant the first one!' : `${flowers.length} memor${flowers.length === 1 ? 'y' : 'ies'} blooming 🌿`}
          </p>
        </div>

        {/* Controls bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <motion.button
            onClick={handlePlantButton}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{
              padding: '10px 22px',
              background: plantingMode
                ? 'linear-gradient(135deg, #4a7c59, #5a9e6f)'
                : selectedAvatar
                  ? 'linear-gradient(135deg, #f4a0b5, #e88aa0)'
                  : isNight ? 'rgba(80,80,160,0.25)' : 'rgba(160,120,80,0.15)',
              color: plantingMode || selectedAvatar ? 'white' : textLightOverride || 'var(--text-light)',
              border: 'none', borderRadius: 22,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              boxShadow: plantingMode ? '0 4px 15px rgba(74,124,89,0.4)' : selectedAvatar ? '0 4px 15px rgba(244,100,130,0.3)' : 'none',
              transition: 'all 0.3s',
            }}
          >
            {plantingMode ? '🌱 Click garden to plant...' : '🌸 Plant a Memory'}
          </motion.button>

          {plantingMode && (
            <motion.button
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              onClick={() => setPlantingMode(false)}
              style={{ padding: '10px 16px', background: isNight ? 'rgba(80,80,160,0.2)' : 'rgba(160,120,80,0.1)', color: textLightOverride || 'var(--text-mid)', border: `1.5px solid ${isNight ? 'rgba(100,100,200,0.3)' : 'rgba(160,120,80,0.2)'}`, borderRadius: 22, fontSize: 13, cursor: 'pointer' }}
            >Cancel</motion.button>
          )}

          {selectedAvatar && !plantingMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 13, color: textLightOverride || 'var(--text-light)' }}>
              {selectedAvatar === 'him' ? NAMES.him : NAMES.her} is ready to plant 🌿
            </motion.div>
          )}
        </div>

        {/* Garden canvas */}
        {loading ? (
          <div style={{ height: 400, borderRadius: 24, background: isNight ? 'rgba(20,30,80,0.3)' : 'rgba(200,180,150,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(200,160,100,0.2)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 40 }}>🌸</motion.div>
          </div>
        ) : (
          <GardenCanvas
            flowers={flowers}
            selectedAvatar={selectedAvatar}
            plantingMode={plantingMode}
            onPlantAt={handlePlantAt}
            onFlowerClick={setSelectedFlower}
            avatarPositions={avatarElements}
            phase={phase}
            weather={weather}
          />
        )}

        {!selectedAvatar && !loading && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            style={{ textAlign: 'center', fontSize: 13, color: textLightOverride || 'var(--text-light)', marginTop: 14 }}
          >
            💡 Click on an avatar to select it, then click "Plant a Memory"
          </motion.p>
        )}

        {/* Memory grid */}
        {flowers.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, color: textDarkOverride || 'var(--text-dark)', marginBottom: 16, textAlign: 'center' }}>
              🌺 Memory Garden
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {[...flowers].reverse().map(flower => (
                <motion.div
                  key={flower.id}
                  whileHover={{ y: -4, boxShadow: isNight ? '0 12px 30px rgba(30,40,120,0.4)' : '0 12px 30px rgba(61,44,30,0.15)' }}
                  onClick={() => setSelectedFlower(flower)}
                  style={{
                    background: isNight ? 'rgba(20,30,70,0.85)' : 'rgba(255,250,245,0.95)',
                    borderRadius: 16, padding: 16, cursor: 'pointer',
                    border: isNight ? '1px solid rgba(80,100,200,0.2)' : '1px solid rgba(200,160,100,0.2)',
                    boxShadow: isNight ? '0 4px 15px rgba(10,20,80,0.3)' : '0 4px 15px rgba(61,44,30,0.08)',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <FlowerSVG type={flower.flowerType} size={44} bloom={2} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--petal-pink)', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {flower.plantedBy}
                      </div>
                      <div style={{ fontSize: 12, color: textLightOverride || 'var(--text-light)' }}>
                        {new Date(flower.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  {flower.photo && (
                    <img src={flower.photo} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 10, marginBottom: 8 }} />
                  )}
                  <p style={{ fontSize: 13, color: textLightOverride || 'var(--text-mid)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {flower.message}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 12, color: textLightOverride || 'var(--text-light)', marginTop: 40, paddingBottom: 20 }}>
          Made with 💕 for {NAMES.him} & {NAMES.her}
        </p>
      </div>

      {pendingPosition && (
        <PlantModal position={pendingPosition} planter={selectedAvatar === 'him' ? NAMES.him : NAMES.her} onPlant={handlePlantConfirm} onClose={() => setPendingPosition(null)} />
      )}

      {selectedFlower && (
        <MemoryModal flower={selectedFlower} onClose={() => setSelectedFlower(null)} onDelete={handleDelete} />
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: isNight ? 'rgba(20,30,80,0.92)' : 'rgba(61,44,30,0.9)', color: 'white', padding: '12px 24px', borderRadius: 24, fontSize: 14, fontWeight: 500, zIndex: 3000, backdropFilter: 'blur(10px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}