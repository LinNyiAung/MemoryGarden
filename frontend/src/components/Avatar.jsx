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
    if (onPhotoChange) onPhotoChange(file);
  };

  const clipId = `head-clip-${side}`;
  const shadowId = `shadow-${side}`;
  const glowId = `glow-${side}`;

  // Derive a darker shade for clothing depth
  const darkerColor = isLeft ? '#4a88ba' : '#d080a0';
  const lightColor = isLeft ? '#a8cce8' : '#f0c0d8';
  const skinTone = '#f5c9a0';
  const skinDark = '#e8b090';

  // Hair colors
  const hairColor = isLeft ? '#2a1e14' : '#8b4a28';
  const hairHighlight = isLeft ? '#4a3020' : '#c07040';

  const mouthPath =
    expression === 'happy' || expression === 'excited'
      ? 'M41 63 Q50 71 59 63'
      : expression === 'planting'
      ? 'M43 63 Q50 67 57 63'
      : 'M44 62 Q50 66 56 62';

  return (
    <motion.div
      onClick={onClick}
      style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
      whileHover={{ scale: 1.06 }}
      animate={
        isSelected
          ? { y: [0, -7, 0], transition: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } }
          : {}
      }
    >
      <div style={{ position: 'relative' }}>
        <svg
          width="96" height="128"
          viewBox="0 0 100 145"
          style={{
            filter: isSelected
              ? `drop-shadow(0 0 12px ${color}bb) drop-shadow(0 4px 8px rgba(0,0,0,0.25))`
              : 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
            overflow: 'visible',
          }}
        >
          <defs>
            <clipPath id={clipId}>
              <circle cx="50" cy="54" r="27" />
            </clipPath>
            <radialGradient id={`bodyGrad-${side}`} cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor={lightColor} />
              <stop offset="100%" stopColor={darkerColor} />
            </radialGradient>
            <radialGradient id={`skinGrad-${side}`} cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#fcdcb4" />
              <stop offset="100%" stopColor={skinTone} />
            </radialGradient>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Ground shadow */}
          <ellipse cx="50" cy="143" rx="22" ry="5" fill="rgba(0,0,0,0.18)" />

          {/* ── BODY ── */}
          {/* Torso */}
          <rect x="29" y="86" width="42" height="48" rx="10" fill={`url(#bodyGrad-${side})`} />
          {/* Collar / neck line detail */}
          <path d="M40 86 Q50 94 60 86" fill="none" stroke={lightColor} strokeWidth="2" opacity="0.7" />
          {/* Clothing highlight */}
          <rect x="33" y="90" width="14" height="30" rx="5" fill={lightColor} opacity="0.18" />

          {/* Buttons or center line */}
          {[96, 104, 112].map((y, i) => (
            <circle key={i} cx="50" cy={y} r="1.8" fill={darkerColor} opacity="0.5" />
          ))}

          {/* ── ARMS ── */}
          {/* Left arm */}
          <rect
            x={isLeft ? 10 : 68}
            y="88" width="22" height="10" rx="5"
            fill={`url(#bodyGrad-${side})`}
            transform={isLeft ? 'rotate(-15, 21, 93)' : 'rotate(15, 79, 93)'}
          />
          {/* Right arm */}
          <rect
            x={isLeft ? 68 : 10}
            y="88" width="22" height="10" rx="5"
            fill={`url(#bodyGrad-${side})`}
            transform={isLeft ? 'rotate(15, 79, 93)' : 'rotate(-15, 21, 93)'}
          />
          {/* Hands */}
          <circle cx={isLeft ? 15 : 85} cy="98" r="6" fill={`url(#skinGrad-${side})`} />
          <circle cx={isLeft ? 85 : 15} cy="98" r="6" fill={`url(#skinGrad-${side})`} />
          {/* Hand knuckle detail */}
          <circle cx={isLeft ? 15 : 85} cy="98" r="3.5" fill="none" stroke={skinDark} strokeWidth="0.8" opacity="0.4" />
          <circle cx={isLeft ? 85 : 15} cy="98" r="3.5" fill="none" stroke={skinDark} strokeWidth="0.8" opacity="0.4" />

          {/* ── LEGS ── */}
          <rect x="32" y="126" width="14" height="16" rx="5" fill={darkerColor} />
          <rect x="54" y="126" width="14" height="16" rx="5" fill={darkerColor} />
          {/* Shoes — more shaped */}
          <ellipse cx="39" cy="141" rx="10" ry="5" fill="#2e1a0e" />
          <ellipse cx="61" cy="141" rx="10" ry="5" fill="#2e1a0e" />
          {/* Shoe highlight */}
          <ellipse cx="37" cy="139" rx="4" ry="2" fill="rgba(255,255,255,0.15)" />
          <ellipse cx="59" cy="139" rx="4" ry="2" fill="rgba(255,255,255,0.15)" />

          {/* ── NECK ── */}
          <rect x="43" y="77" width="14" height="14" rx="4" fill={`url(#skinGrad-${side})`} />
          <line x1="50" y1="78" x2="50" y2="88" stroke={skinDark} strokeWidth="0.8" opacity="0.3" />

          {/* ── HEAD ── */}
          {photo ? (
            <>
              <circle cx="50" cy="54" r="29"
                fill={isSelected ? color : 'rgba(255,255,255,0.85)'}
                opacity="0.4"
              />
              <circle cx="50" cy="54" r="28"
                fill="none"
                stroke={isSelected ? color : 'rgba(255,255,255,0.9)'}
                strokeWidth={isSelected ? 3.5 : 2.5}
              />
              <image
                href={photo}
                x="23" y="27"
                width="54" height="54"
                clipPath={`url(#${clipId})`}
                preserveAspectRatio="xMidYMid slice"
              />
              {/* Photo vignette */}
              <circle cx="50" cy="54" r="27"
                fill="none"
                stroke="rgba(0,0,0,0.07)"
                strokeWidth="5"
                clipPath={`url(#${clipId})`}
              />
            </>
          ) : (
            <>
              {/* Head shape — slightly more oval */}
              <ellipse cx="50" cy="54" rx="25" ry="27" fill={`url(#skinGrad-${side})`} />

              {/* ── HAIR ── */}
              {isLeft ? (
                /* Him: short neat dark hair */
                <>
                  <ellipse cx="50" cy="30" rx="25" ry="14" fill={hairColor} />
                  <rect x="25" y="30" width="50" height="12" fill={hairColor} />
                  {/* Side parts */}
                  <ellipse cx="27" cy="46" rx="6.5" ry="11" fill={hairColor} />
                  <ellipse cx="73" cy="46" rx="6.5" ry="11" fill={hairColor} />
                  {/* Hair highlight */}
                  <ellipse cx="44" cy="28" rx="8" ry="4" fill={hairHighlight} opacity="0.5" />
                  {/* Part line */}
                  <path d="M44 28 Q47 35 45 42" stroke={hairHighlight} strokeWidth="1" opacity="0.4" fill="none" />
                </>
              ) : (
                /* Her: longer flowing hair */
                <>
                  <ellipse cx="50" cy="29" rx="26" ry="16" fill={hairColor} />
                  <rect x="24" y="30" width="10" height="38" rx="5" fill={hairColor} />
                  <rect x="66" y="30" width="10" height="38" rx="5" fill={hairColor} />
                  <ellipse cx="27" cy="44" rx="7.5" ry="14" fill={hairColor} />
                  <ellipse cx="73" cy="44" rx="7.5" ry="14" fill={hairColor} />
                  {/* Hair highlights */}
                  <path d="M38 28 Q42 35 40 50" stroke={hairHighlight} strokeWidth="2" opacity="0.45" fill="none" strokeLinecap="round" />
                  <path d="M54 27 Q57 34 55 50" stroke={hairHighlight} strokeWidth="1.5" opacity="0.35" fill="none" strokeLinecap="round" />
                  {/* Hair accessory — small flower clip for her */}
                  <circle cx="27" cy="36" r="5" fill={color} opacity="0.85" />
                  <circle cx="27" cy="36" r="2.5" fill="#fff8e0" />
                  {[0, 72, 144, 216, 288].map((a, i) => (
                    <ellipse key={i}
                      cx={27 + Math.cos(a * Math.PI / 180) * 4.5}
                      cy={36 + Math.sin(a * Math.PI / 180) * 4.5}
                      rx="2" ry="3"
                      fill={color} opacity="0.7"
                      transform={`rotate(${a}, ${27 + Math.cos(a * Math.PI / 180) * 4.5}, ${36 + Math.sin(a * Math.PI / 180) * 4.5})`}
                    />
                  ))}
                </>
              )}

              {/* ── EYES ── */}
              {/* Eye whites */}
              <ellipse cx="41" cy="53" rx="5" ry="5.5" fill="white" />
              <ellipse cx="59" cy="53" rx="5" ry="5.5" fill="white" />
              {/* Irises */}
              <circle cx="42" cy="54" r="3.5" fill={isLeft ? '#4a3020' : '#7a4030'} />
              <circle cx="60" cy="54" r="3.5" fill={isLeft ? '#4a3020' : '#7a4030'} />
              {/* Pupils */}
              <circle cx="42.5" cy="54.5" r="2" fill="#1a1008" />
              <circle cx="60.5" cy="54.5" r="2" fill="#1a1008" />
              {/* Eye shine */}
              <circle cx="43.5" cy="53.2" r="1.2" fill="white" opacity="0.9" />
              <circle cx="61.5" cy="53.2" r="1.2" fill="white" opacity="0.9" />
              <circle cx="44.2" cy="55" r="0.5" fill="white" opacity="0.5" />
              <circle cx="62.2" cy="55" r="0.5" fill="white" opacity="0.5" />

              {/* Eyelashes — her */}
              {!isLeft && [38, 40, 42, 44].map((x, i) => (
                <line key={i} x1={x} y1="48.5" x2={x - 1 + i * 0.5} y2="46" stroke="#5a2810" strokeWidth="1" strokeLinecap="round" />
              ))}
              {!isLeft && [56, 58, 60, 62].map((x, i) => (
                <line key={i} x1={x} y1="48.5" x2={x - 0.5 + i * 0.5} y2="46" stroke="#5a2810" strokeWidth="1" strokeLinecap="round" />
              ))}

              {/* Eyebrows */}
              <path
                d={isLeft ? 'M37 47.5 Q41 45.5 46 47' : 'M37 46.5 Q41 44 46 46'}
                stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round"
              />
              <path
                d={isLeft ? 'M54 47 Q59 45.5 63 47.5' : 'M54 46 Q59 44 63 46.5'}
                stroke={hairColor} strokeWidth="1.8" fill="none" strokeLinecap="round"
              />

              {/* Nose */}
              <path d="M47.5 57 Q50 62.5 52.5 57" stroke={skinDark} strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Mouth */}
              <path d={mouthPath} stroke="#c06060" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              {/* Teeth hint for happy */}
              {(expression === 'happy' || expression === 'excited') && (
                <path d="M43 65 Q50 69 57 65 Q53 70 47 70 Z" fill="white" opacity="0.6" />
              )}

              {/* Cheeks */}
              <ellipse cx="35" cy="61" rx="5.5" ry="4" fill="#f09090" opacity="0.3" />
              <ellipse cx="65" cy="61" rx="5.5" ry="4" fill="#f09090" opacity="0.3" />

              {/* Photo upload hint ring */}
              <circle cx="50" cy="54" r="27" fill="none" stroke="rgba(160,120,80,0.35)"
                strokeWidth="1.5" strokeDasharray="5 4" />
            </>
          )}

          {/* Selected indicator — name badge */}
          {isSelected && (
            <g>
              <rect x="15" y="-2" width="70" height="20" rx="10"
                fill={color} opacity="0.95"
                style={{ filter: `drop-shadow(0 2px 6px ${color}88)` }}
              />
              <text x="50" y="12" textAnchor="middle" fontSize="9" fill="white"
                fontFamily="Lato, sans-serif" fontWeight="700" letterSpacing="0.5">
                {name}
              </text>
              {/* Small sparkles when selected */}
              {[[-12, -8], [12, -6], [0, -14]].map(([dx, dy], i) => (
                <motion.text key={i} x={50 + dx} y={dy + 10} fontSize="8"
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                  textAnchor="middle"
                >
                  ✦
                </motion.text>
              ))}
            </g>
          )}
        </svg>

        {/* Camera badge */}
        {onPhotoChange && (
          <button
            onClick={handlePhotoClick}
            title={photo ? 'Change photo' : 'Add your photo'}
            style={{
              position: 'absolute',
              bottom: 30, right: -2,
              width: 28, height: 28,
              borderRadius: '50%',
              background: photo ? color : 'rgba(255,250,245,0.97)',
              border: `2.5px solid ${color}`,
              fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: `0 2px 10px rgba(0,0,0,0.2), 0 0 0 1px ${color}44`,
              transition: 'transform 0.15s',
              zIndex: 2,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.18)'}
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
        fontFamily: "'Lato', sans-serif",
        color: isSelected ? 'white' : 'var(--text-mid)',
        fontWeight: isSelected ? 700 : 500,
        background: isSelected
          ? `linear-gradient(135deg, ${color}, ${darkerColor})`
          : 'rgba(255,250,245,0.75)',
        padding: '3px 12px',
        borderRadius: 12,
        transition: 'all 0.25s',
        marginTop: -4,
        boxShadow: isSelected ? `0 3px 12px ${color}55` : '0 1px 4px rgba(61,44,30,0.08)',
        border: isSelected ? 'none' : '1px solid rgba(160,120,80,0.15)',
        letterSpacing: 0.3,
      }}>
        {name}
      </span>
    </motion.div>
  );
}

export default Avatar;