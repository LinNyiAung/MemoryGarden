import { motion } from 'framer-motion';
import { useRef } from 'react';

function Avatar({ name, color, isSelected, side = 'left', onClick, photo, onPhotoChange, expression = 'idle' }) {
  const fileRef = useRef();
  const isLeft = side === 'left';

  const handlePhotoClick = (e) => {
    e.stopPropagation();
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // We now pass the raw file directly up to App.jsx instead of reading as Base64
    if (onPhotoChange) onPhotoChange(file);
  };

  // Unique clip-path id per avatar so they don't clash
  const clipId = `head-clip-${side}`;
  const glowId = `glow-${side}`;

  return (
    <motion.div
      onClick={onClick}
      style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
      whileHover={{ scale: 1.05 }}
      animate={isSelected ? { y: [0, -6, 0], transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' } } : {}}
    >
      <div style={{ position: 'relative' }}>
        <svg
          width="90" height="120"
          viewBox="0 0 100 140"
          style={{ filter: isSelected ? `drop-shadow(0 0 10px ${color}cc)` : 'none', overflow: 'visible' }}
        >
          <defs>
            {/* Circular clip for the photo head */}
            <clipPath id={clipId}>
              <circle cx="50" cy="56" r="26" />
            </clipPath>
            {/* Glow filter when selected */}
            <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Ground shadow */}
          <ellipse cx="50" cy="138" rx="20" ry="5" fill="rgba(0,0,0,0.15)" />

          {/* Body */}
          <rect x="30" y="85" width="40" height="45" rx="8" fill={color} />

          {/* Arms */}
          <rect x="12" y="87" width="20" height="9" rx="4.5" fill={color}
            transform={isLeft ? 'rotate(-12,22,91)' : 'rotate(12,78,91)'} />
          <rect x="68" y="87" width="20" height="9" rx="4.5" fill={color}
            transform={isLeft ? 'rotate(12,78,91)' : 'rotate(-12,22,91)'} />

          {/* Hands */}
          <circle cx={isLeft ? 17 : 83} cy="97" r="5.5" fill="#f5c9a0" />
          <circle cx={isLeft ? 83 : 17} cy="97" r="5.5" fill="#f5c9a0" />

          {/* Legs */}
          <rect x="33" y="125" width="13" height="13" rx="4" fill={color} />
          <rect x="54" y="125" width="13" height="13" rx="4" fill={color} />
          {/* Shoes */}
          <ellipse cx="39" cy="137" rx="9" ry="5" fill="#3a2010" />
          <ellipse cx="61" cy="137" rx="9" ry="5" fill="#3a2010" />

          {/* Neck */}
          <rect x="43" y="76" width="14" height="14" rx="4" fill="#f5c9a0" />

          {/* ── HEAD ── */}
          {photo ? (
            /* Real photo, clipped to circle */
            <>
              {/* Outline ring */}
              <circle cx="50" cy="56" r="28"
                fill="none"
                stroke={isSelected ? color : 'rgba(255,255,255,0.9)'}
                strokeWidth={isSelected ? 3.5 : 2.5} />
              {/* Photo */}
              <image
                href={photo}
                x="24" y="30"
                width="52" height="52"
                clipPath={`url(#${clipId})`}
                preserveAspectRatio="xMidYMid slice"
              />
              {/* Subtle inner shadow overlay */}
              <circle cx="50" cy="56" r="26"
                fill="none"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth="4"
                clipPath={`url(#${clipId})`}
              />
            </>
          ) : (
            /* Default cartoon head — same style as before */
            <>
              <ellipse cx="50" cy="56" rx="24" ry="26" fill="#f5c9a0" />
              {/* Hair */}
              {isLeft ? (
                <>
                  <ellipse cx="50" cy="33" rx="24" ry="13" fill="#3d2c1e" />
                  <rect x="26" y="33" width="48" height="10" fill="#3d2c1e" />
                  <ellipse cx="28" cy="47" rx="6" ry="10" fill="#3d2c1e" />
                  <ellipse cx="72" cy="47" rx="6" ry="10" fill="#3d2c1e" />
                </>
              ) : (
                <>
                  <ellipse cx="50" cy="31" rx="25" ry="15" fill="#7c4a2e" />
                  <rect x="24" y="33" width="8" height="34" rx="4" fill="#7c4a2e" />
                  <rect x="68" y="33" width="8" height="34" rx="4" fill="#7c4a2e" />
                  <ellipse cx="28" cy="45" rx="7" ry="12" fill="#7c4a2e" />
                  <ellipse cx="72" cy="45" rx="7" ry="12" fill="#7c4a2e" />
                </>
              )}
              {/* Eyes */}
              <circle cx="42" cy="55" r="4" fill="white" />
              <circle cx="58" cy="55" r="4" fill="white" />
              <circle cx="43" cy="56" r="2.5" fill="#3d2c1e" />
              <circle cx="59" cy="56" r="2.5" fill="#3d2c1e" />
              <circle cx="43.5" cy="55.5" r="1" fill="white" opacity="0.8" />
              <circle cx="59.5" cy="55.5" r="1" fill="white" opacity="0.8" />
              {/* Mouth */}
              <path d={expression === 'happy' || expression === 'excited'
                ? 'M42 63 Q50 70 58 63'
                : 'M44 62 Q50 66 56 62'}
                stroke="#c87060" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Cheeks */}
              <ellipse cx="36" cy="62" rx="5" ry="3.5" fill="#f4a0a0" opacity="0.4" />
              <ellipse cx="64" cy="62" rx="5" ry="3.5" fill="#f4a0a0" opacity="0.4" />
              {/* Nose */}
              <path d="M48 57 Q50 62 52 57" stroke="#c8a090" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Camera icon hint — shown on hover area, only if no photo yet */}
          {!photo && (
            <g opacity="0.55">
              <circle cx="50" cy="56" r="26" fill="none" stroke="rgba(160,120,80,0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
            </g>
          )}

          {/* Selected name tag */}
          {isSelected && (
            <g>
              <rect x="18" y="1" width="64" height="18" rx="9" fill={color} opacity="0.92" />
              <text x="50" y="14" textAnchor="middle" fontSize="9.5" fill="white"
                fontFamily="Lato, sans-serif" fontWeight="700">{name}</text>
            </g>
          )}
        </svg>

        {/* Photo upload button — small camera badge bottom-right of head */}
        {onPhotoChange && (
          <button
            onClick={handlePhotoClick}
            title={photo ? 'Change photo' : 'Add your photo'}
            style={{
              position: 'absolute',
              bottom: 28, right: -2,
              width: 26, height: 26,
              borderRadius: '50%',
              background: photo ? color : 'rgba(255,250,245,0.95)',
              border: `2px solid ${color}`,
              fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              transition: 'transform 0.15s',
              zIndex: 2,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            📷
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* Name label */}
      <span style={{
        fontSize: 12,
        fontFamily: 'Lato, sans-serif',
        color: 'var(--text-mid)',
        fontWeight: isSelected ? 700 : 400,
        background: isSelected ? `${color}28` : 'transparent',
        padding: '2px 10px',
        borderRadius: 10,
        transition: 'all 0.2s',
        marginTop: -2,
      }}>{name}</span>
    </motion.div>
  );
}

export default Avatar;
