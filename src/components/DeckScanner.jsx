import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

// The door deck: click it, drag the top card off, or press Space to draw the next doors.
export default function DeckScanner({ cardBack, onDeal, ready }) {
  const dragged = useRef(false);
  const { full } = useSettings();

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <span className="hud-label">{ready ? 'Draw doors' : 'Doors'}</span>
      <div className="relative" style={{ width: 'var(--deck-w)', height: 'var(--deck-h)' }}>
        {[3, 2, 1].map((i) => (
          <div
            key={i}
            className="absolute inset-0 card-shape bg-cover bg-center"
            style={{
              backgroundImage: `url(${cardBack})`,
              transform: `translate(${i * 4}px, ${i * 4}px) rotate(${i * 1.5}deg)`,
              filter: 'brightness(0.35)',
            }}
          />
        ))}
        <motion.button
          className="absolute inset-0 card-shape bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${cardBack})`, cursor: ready ? 'grab' : 'default', touchAction: 'none' }}
          drag={ready}
          dragSnapToOrigin
          dragElastic={0.5}
          whileDrag={{ scale: 1.08, rotate: 6, cursor: 'grabbing' }}
          whileHover={ready ? { scale: 1.04, rotate: -1.5 } : undefined}
          whileTap={ready ? { scale: 0.97 } : undefined}
          onDragStart={() => {
            dragged.current = true;
          }}
          onDragEnd={(_, info) => {
            setTimeout(() => {
              dragged.current = false;
            }, 60);
            if (Math.hypot(info.offset.x, info.offset.y) > 60) onDeal();
          }}
          onClick={() => {
            if (!dragged.current && ready) onDeal();
          }}
          animate={{ filter: ready ? 'brightness(1)' : 'brightness(0.45) grayscale(0.6)' }}
          aria-label="Draw the next doors"
          aria-disabled={!ready}
        >
          {ready && <div className="scan-beam" />}
          {ready && (
            <motion.div
              className="absolute inset-0"
              style={{ boxShadow: 'inset 0 0 0 2px var(--accent), inset 0 0 30px var(--accent-soft)' }}
              animate={{ opacity: full ? [0.4, 1, 0.4] : 1 }}
              transition={full ? { repeat: Infinity, duration: 1.6 } : {}}
            />
          )}
        </motion.button>
      </div>
      <span className="keys-only hud-label mt-3">
        <kbd>Space</kbd>
      </span>
    </div>
  );
}
