/**
 * WeatherBadge.jsx
 * Displays the current weather condition, temperature, and city name.
 * Sits in the top-right corner, stacked below the DayNightBadge in App.jsx.
 *
 * Props:
 *   weather      — object from useWeather()
 *   locationName — string | null
 *   loading      — boolean
 *   error        — string | null
 *   isNight      — boolean (from useDayNight phase)
 *   onRefresh    — () => void
 */

import { motion, AnimatePresence } from 'framer-motion';

function WeatherBadge({ weather, locationName, loading, error, isNight, onRefresh }) {
  const nightStyle = {
    background: 'rgba(10,20,60,0.82)',
    border: '1px solid rgba(100,130,255,0.25)',
    color: 'rgba(180,200,255,0.9)',
    subColor: 'rgba(140,160,220,0.7)',
    shadow: '0 4px 20px rgba(10,20,80,0.5)',
  };
  const dayStyle = {
    background: 'rgba(255,250,245,0.88)',
    border: '1px solid rgba(200,160,100,0.25)',
    color: 'var(--text-mid)',
    subColor: 'var(--text-light)',
    shadow: '0 4px 20px rgba(61,44,30,0.12)',
  };
  const s = isNight ? nightStyle : dayStyle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
      style={{
        position: 'fixed', top: 60, right: 16, zIndex: 200,
        background: s.background,
        backdropFilter: 'blur(12px)',
        border: s.border,
        borderRadius: 24,
        padding: '7px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: s.shadow,
        cursor: onRefresh ? 'pointer' : 'default',
        minWidth: 120,
      }}
      onClick={onRefresh}
      title={onRefresh ? 'Click to refresh weather' : ''}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ fontSize: 15 }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block' }}
            >🌀</motion.span>
          </motion.span>
        ) : error ? (
          <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ fontSize: 14 }}>🌐</motion.span>
        ) : weather ? (
          <motion.span key={weather.condition}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 14 }}
            style={{ fontSize: 16 }}>
            {weather.emoji}
          </motion.span>
        ) : null}
      </AnimatePresence>

      <div>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
          color: s.color, lineHeight: 1.2,
        }}>
          {loading
            ? 'Checking weather…'
            : error
              ? 'Weather unavailable'
              : weather
                ? `${weather.label} · ${weather.temp}°C`
                : '—'}
        </div>
        {!loading && !error && (locationName || weather) && (
          <div style={{
            fontSize: 10, color: s.subColor, lineHeight: 1.2,
          }}>
            {locationName
              ? `📍 ${locationName}`
              : weather
                ? `💨 ${weather.windspeed} km/h · 💧 ${weather.humidity}%`
                : ''}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default WeatherBadge;