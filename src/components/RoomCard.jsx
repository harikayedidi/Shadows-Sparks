import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { KIND_STYLE } from '../data/themes';
import { useTilt } from '../hooks/useTilt';
import Typewriter from './Typewriter';

const KIND_BG = {
  safe: 'radial-gradient(circle at 50% 0%, #1b2433 0%, #06080f 70%)',
  trap: 'radial-gradient(circle at 50% 10%, rgba(255,248,214,0.55) 0%, #3a2f1a 35%, #0b0806 80%)',
  choice: 'radial-gradient(circle at 50% 0%, #3b1f5e 0%, #0b0614 75%)',
  supply: 'radial-gradient(circle at 50% 0%, #4a3410 0%, #0e0904 75%)',
};

// The room you entered. Flips from the door art to its contents, then types out the flavor text.
const RoomCard = forwardRef(function RoomCard({ card, cardBack, corrupted, dim = false }, ref) {
  const tilt = useTilt(6);
  const [landed, setLanded] = useState(false);
  const style = KIND_STYLE[card.kind];

  return (
    <motion.div
      ref={ref}
      layoutId={`card-${card.uid}`}
      className="flip-scene"
      style={{ width: 'var(--card-w)', height: 'var(--card-h)' }}
      animate={{ opacity: dim ? 0.55 : 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="flip-inner"
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.75, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        onAnimationComplete={() => setLanded(true)}
        style={tilt.style}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
      >
        <article
          className="flip-face card-shape overflow-hidden flex flex-col"
          style={{ background: KIND_BG[card.kind], boxShadow: `inset 0 0 0 1px ${style.color}99` }}
          aria-live="polite"
        >
          <div className="absolute inset-0 card-grid" />
          {card.kind === 'trap' && (
            <motion.div
              className="absolute inset-0"
              style={{ background: 'conic-gradient(from 180deg at 50% -10%, transparent 0deg, rgba(255,250,220,0.25) 20deg, transparent 40deg, rgba(255,250,220,0.18) 60deg, transparent 80deg)' }}
              animate={{ opacity: [0.4, 1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}

          <div className="relative flex items-center justify-between px-3 pt-3">
            <span className="font-mono text-[10px] tracking-[0.25em]" style={{ color: style.color }}>
              {style.icon} {style.label}
            </span>
            {card.damage ? (
              <span className="font-display text-xs font-bold px-1.5" style={{ color: '#ff3c5a', border: '1px solid #ff3c5a88' }}>
                −{card.damage}
              </span>
            ) : null}
          </div>

          <h2
            className="relative font-display font-bold text-base sm:text-xl leading-tight px-3 mt-2"
            style={{ color: '#fff', textShadow: `0 0 14px ${style.color}` }}
          >
            {card.title}
          </h2>
          <p className="relative px-3 mt-1 text-sm text-slate-300 leading-snug">{card.description}</p>

          <div className="relative mt-auto px-3 pb-3">
            <div className="h-px w-full mb-2" style={{ background: `${style.color}55` }} />
            <p className="font-mono text-[11px] sm:text-xs leading-relaxed text-slate-400 min-h-[4.5em]">
              <Typewriter text={card.flavor} start={landed} speed={16} />
            </p>
          </div>

          <div className="holo-sheen" />
          {corrupted && (
            <>
              <div className="corrupt-overlay" />
              <span className="absolute top-1/2 left-0 right-0 text-center font-display text-xs tracking-[0.4em] text-[#ff3c5a]">CORRUPTED</span>
            </>
          )}
        </article>

        <div className="flip-face flip-back card-shape bg-cover bg-center" style={{ backgroundImage: `url(${cardBack})` }} />
      </motion.div>
    </motion.div>
  );
});

export default RoomCard;
