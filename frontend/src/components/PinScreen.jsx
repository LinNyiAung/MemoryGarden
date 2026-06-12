import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PinScreen({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === '19122025') {
      onUnlock();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sky)',
        padding: 20,
      }}
    >
      <motion.div
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{
          background: 'var(--card-bg)',
          padding: '40px 30px',
          borderRadius: 24,
          boxShadow: '0 12px 30px var(--shadow)',
          textAlign: 'center',
          maxWidth: 360,
          width: '100%',
          border: '1px solid rgba(200,160,100,0.2)',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
        <h2 style={{ 
          color: 'var(--text-dark)', 
          marginBottom: 8,
          fontSize: 24 
        }}>
          Memory Garden
        </h2>
        <p style={{ 
          color: 'var(--text-mid)', 
          fontSize: 14, 
          marginBottom: 24 
        }}>
          Please enter the PIN to enter our garden.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: 18,
              textAlign: 'center',
              letterSpacing: 4,
              border: `2px solid ${error ? 'var(--petal-red)' : 'rgba(200,160,100,0.3)'}`,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.8)',
              color: 'var(--text-dark)',
              outline: 'none',
              marginBottom: 20,
              transition: 'border-color 0.2s',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, var(--petal-pink), #e88aa0)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              boxShadow: '0 4px 15px var(--glow-pink)',
            }}
          >
            Enter Garden
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}