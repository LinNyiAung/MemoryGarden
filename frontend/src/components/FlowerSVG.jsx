// Flower type definitions with SVG renderers

export const FLOWER_TYPES = [
  { id: 'rose', name: 'Rose', emoji: '🌹', color: '#e86a6a' },
  { id: 'daisy', name: 'Daisy', emoji: '🌼', color: '#f7d76a' },
  { id: 'tulip', name: 'Tulip', emoji: '🌷', color: '#f4a0b5' },
  { id: 'lavender', name: 'Lavender', emoji: '💜', color: '#c8a4d4' },
  { id: 'sunflower', name: 'Sunflower', emoji: '🌻', color: '#f5c842' },
  { id: 'lily', name: 'Lily', emoji: '🪷', color: '#f4b8d0' },
  { id: 'bluebell', name: 'Bluebell', emoji: '🔵', color: '#9ab8e4' },
  { id: 'cosmos', name: 'Cosmos', emoji: '🌸', color: '#e8a4c8' },
];

const stemPath = (h = 40) => (
  <g>
    <line x1="50" y1={100 - h} x2="50" y2="100" stroke="#4a7c59" strokeWidth="3" strokeLinecap="round" />
    <path d={`M50 ${100 - h * 0.4} Q35 ${100 - h * 0.55} 30 ${100 - h * 0.7}`} stroke="#4a7c59" strokeWidth="2" fill="none" strokeLinecap="round" />
  </g>
);

function Rose({ size = 100, animate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {stemPath(45)}
      <g style={animate ? { animation: 'bloom 0.6s ease-out' } : {}}>
        {[0,60,120,180,240,300].map((a, i) => (
          <ellipse key={i} cx={50 + Math.cos(a*Math.PI/180)*14} cy={55 + Math.sin(a*Math.PI/180)*14}
            rx="10" ry="13" fill="#e86a6a" opacity="0.85"
            transform={`rotate(${a+90}, ${50 + Math.cos(a*Math.PI/180)*14}, ${55 + Math.sin(a*Math.PI/180)*14})`} />
        ))}
        {[30,90,150,210,270,330].map((a, i) => (
          <ellipse key={i} cx={50 + Math.cos(a*Math.PI/180)*8} cy={55 + Math.sin(a*Math.PI/180)*8}
            rx="7" ry="10" fill="#f07a8a" opacity="0.9"
            transform={`rotate(${a+90}, ${50 + Math.cos(a*Math.PI/180)*8}, ${55 + Math.sin(a*Math.PI/180)*8})`} />
        ))}
        <circle cx="50" cy="55" r="8" fill="#c8485a" />
      </g>
    </svg>
  );
}

function Daisy({ size = 100, animate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {stemPath(42)}
      <g style={animate ? { animation: 'bloom 0.6s ease-out' } : {}}>
        {[0,36,72,108,144,180,216,252,288,324].map((a, i) => (
          <ellipse key={i} cx={50 + Math.cos(a*Math.PI/180)*17} cy={55 + Math.sin(a*Math.PI/180)*17}
            rx="5" ry="12" fill="white" stroke="#e8e0d0" strokeWidth="0.5"
            transform={`rotate(${a}, ${50 + Math.cos(a*Math.PI/180)*17}, ${55 + Math.sin(a*Math.PI/180)*17})`} />
        ))}
        <circle cx="50" cy="55" r="10" fill="#f7d76a" />
        <circle cx="50" cy="55" r="6" fill="#e8c050" />
      </g>
    </svg>
  );
}

function Tulip({ size = 100, animate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {stemPath(40)}
      <g style={animate ? { animation: 'bloom 0.6s ease-out' } : {}}>
        <ellipse cx="43" cy="55" rx="10" ry="18" fill="#f4a0b5" transform="rotate(-15,43,55)" />
        <ellipse cx="57" cy="55" rx="10" ry="18" fill="#f4a0b5" transform="rotate(15,57,55)" />
        <ellipse cx="50" cy="50" rx="10" ry="20" fill="#f7b8c8" />
        <ellipse cx="50" cy="47" rx="7" ry="5" fill="#fbd0dc" />
      </g>
    </svg>
  );
}

function Lavender({ size = 100, animate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g>
        <line x1="50" y1="30" x2="50" y2="100" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="55" x2="38" y2="70" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="50" y1="60" x2="62" y2="75" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <g style={animate ? { animation: 'bloom 0.6s ease-out' } : {}}>
        {[30,36,42,48,54,60,66,72,78].map((y, i) => (
          <g key={i}>
            <ellipse cx={50 + (i%2===0?-4:4)} cy={y} rx="3.5" ry="5" fill="#c8a4d4" opacity={0.7 + i*0.03} />
            <ellipse cx={50 + (i%2===0?4:-4)} cy={y+3} rx="3.5" ry="5" fill="#d4b0e0" opacity={0.7 + i*0.03} />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Sunflower({ size = 100, animate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {stemPath(45)}
      <g style={animate ? { animation: 'bloom 0.6s ease-out' } : {}}>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
          <ellipse key={i} cx={50 + Math.cos(a*Math.PI/180)*18} cy={55 + Math.sin(a*Math.PI/180)*18}
            rx="5" ry="14" fill="#f5c842"
            transform={`rotate(${a}, ${50 + Math.cos(a*Math.PI/180)*18}, ${55 + Math.sin(a*Math.PI/180)*18})`} />
        ))}
        <circle cx="50" cy="55" r="14" fill="#6b3a1f" />
        <circle cx="50" cy="55" r="11" fill="#7d4a2a" />
        {[0,45,90,135,180,225,270,315].map((a,i)=>(
          <circle key={i} cx={50+Math.cos(a*Math.PI/180)*6} cy={55+Math.sin(a*Math.PI/180)*6} r="2" fill="#4a2810" key={i}/>
        ))}
      </g>
    </svg>
  );
}

function Lily({ size = 100, animate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {stemPath(42)}
      <g style={animate ? { animation: 'bloom 0.6s ease-out' } : {}}>
        {[0,60,120,180,240,300].map((a, i) => (
          <ellipse key={i} cx={50 + Math.cos(a*Math.PI/180)*15} cy={55 + Math.sin(a*Math.PI/180)*15}
            rx="6" ry="16" fill={i%2===0?"#f4b8d0":"#fac8dc"}
            transform={`rotate(${a}, ${50 + Math.cos(a*Math.PI/180)*15}, ${55 + Math.sin(a*Math.PI/180)*15})`} />
        ))}
        {[0,60,120,180,240,300].map((a, i) => (
          <line key={i} x1="50" y1="55"
            x2={50 + Math.cos(a*Math.PI/180)*20} y2={55 + Math.sin(a*Math.PI/180)*20}
            stroke="#f5d060" strokeWidth="1" strokeLinecap="round" />
        ))}
        <circle cx="50" cy="55" r="4" fill="#f5e0a0" />
      </g>
    </svg>
  );
}

function Bluebell({ size = 100, animate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g>
        <line x1="50" y1="25" x2="50" y2="100" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" />
        {[-20,-10,0,10,20].map((x,i)=>(
          <line key={i} x1="50" y1={45+i*5} x2={50+x} y2={55+i*5} stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </g>
      <g style={animate ? { animation: 'bloom 0.6s ease-out' } : {}}>
        {[-20,-10,0,10,20].map((x,i)=>(
          <g key={i} transform={`translate(${50+x}, ${52+i*5})`}>
            <path d="M0,-12 Q8,-8 8,0 Q8,10 0,12 Q-8,10 -8,0 Q-8,-8 0,-12" fill="#9ab8e4" opacity="0.85" />
            <path d="M0,-12 Q4,-6 4,0 Q4,8 0,12" fill="#bcd0f0" opacity="0.5" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Cosmos({ size = 100, animate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {stemPath(42)}
      <g style={animate ? { animation: 'bloom 0.6s ease-out' } : {}}>
        {[0,45,90,135,180,225,270,315].map((a, i) => (
          <ellipse key={i} cx={50 + Math.cos(a*Math.PI/180)*16} cy={55 + Math.sin(a*Math.PI/180)*16}
            rx="5" ry="12" fill={i%2===0?"#e8a4c8":"#f0b8d8"}
            transform={`rotate(${a}, ${50 + Math.cos(a*Math.PI/180)*16}, ${55 + Math.sin(a*Math.PI/180)*16})`} />
        ))}
        <circle cx="50" cy="55" r="7" fill="#f7d76a" />
        <circle cx="50" cy="55" r="4" fill="#e8c050" />
      </g>
    </svg>
  );
}

// Seed/sprout stages
function Seed({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="80" rx="8" ry="5" fill="#7c5c3e" opacity="0.6" />
      <ellipse cx="50" cy="76" rx="6" ry="8" fill="#a07850" />
    </svg>
  );
}

function Sprout({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <line x1="50" y1="60" x2="50" y2="100" stroke="#4a7c59" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 70 Q35 55 32 45 Q42 48 50 65" fill="#5a9e6f" />
      <path d="M50 65 Q65 52 68 42 Q58 46 50 62" fill="#7ec896" />
    </svg>
  );
}

const FLOWER_COMPONENTS = { rose: Rose, daisy: Daisy, tulip: Tulip, lavender: Lavender, sunflower: Sunflower, lily: Lily, bluebell: Bluebell, cosmos: Cosmos };

export function FlowerSVG({ type = 'rose', size = 100, bloom = 2, animate = false }) {
  if (bloom === 0) return <Seed size={size * 0.6} />;
  if (bloom === 1) return <Sprout size={size * 0.7} />;
  const Comp = FLOWER_COMPONENTS[type] || Rose;
  return <Comp size={size} animate={animate} />;
}

export default FlowerSVG;
