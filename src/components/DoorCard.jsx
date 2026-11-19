import { forwardRef, useRef } from 'react';
import { motion } from 'framer-motion';
import { HINTS } from '../data/cards';
import { KIND_STYLE } from '../data/themes';
import { useTilt } from '../hooks/useTilt';
import { useSettings } from '../hooks/useSettings';

const SignalBars = ({ color, strength, animate }) => (
  <div className="flex items-end gap-[2px] h-3" aria-hidden="true">
    {[0, 1, 2, 3].map((i) => (
      <motion.span
        key={i}
        className="w-[3px]"
        style={{ height: `${(i + 1) * 25}%`, background: i < strength ? color : 'rgba(255,255,255,0.15)' }}
        animate={animate && i < strength ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={animate ? { repeat: Infinity, duration: 1 + i * 0.3 } : {}}
      />
    ))}
  </div>
);

// A closed door with a tag that hints at what's inside. Click, drag up, or press its number to enter.
const DoorCard = forwardRef(function DoorCard({ door, index, cardBack, corrupted, compact = false, onEnter, onHover }, ref) {
  const tilt = useTilt(10);
  const { full } = useSettings();
  const dragged = useRef(false);
  const shownKind = door.revealed ? door.card.kind : door.hint.kind;
  const style = KIND_STYLE[shownKind];
  const label = door.revealed ? style.label : HINTS[door.hint.kind].label;
  const line = door.revealed ? door.card.title : door.hint.line;
  const strength = door.revealed ? 4 : door.hint.kind === 'unknown' ? 0 : 2;

  return (
    <motion.div
      ref={ref}
      layoutId={`card-${door.card.uid}`}
      initial={{ opacity: 0, y: -60, rotateZ: (index - 1) * -8, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, rotateZ: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.85, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: index * 0.08 }}
    >
      <motion.button
        className="relative card-shape overflow-hidden text-left block"
        style={{ ...tilt.style, width: 'var(--door-w)', height: 'var(--door-h)', touchAction: 'none' }}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        onMouseEnter={onHover}
        drag="y"
        dragConstraints={{ top: -150, bottom: 0 }}
        dragElastic={0.15}
        dragSnapToOrigin
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        whileDrag={{ scale: 1.06 }}
        onDragStart={() => {
          dragged.current = true;
        }}
        onDragEnd={(_, info) => {
          setTimeout(() => {
            dragged.current = false;
          }, 60);
          if (info.offset.y < -70) onEnter(index);
        }}
        onClick={() => {
          if (!dragged.current) onEnter(index);
        }}
        aria-label={`Door ${index + 1}. ${door.revealed ? 'Shown' : 'Tag says'} ${label}: ${line}`}
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cardBack})`, filter: 'brightness(0.4) saturate(0.8)' }} />
        <div className="absolute inset-0 card-grid" />
        <motion.div
          className="absolute inset-0"
          style={{ border: `1px solid ${style.color}88`, boxShadow: `inset 0 0 40px ${style.color}33` }}
          animate={shownKind === 'trap' && full ? { opacity: [0.6, 1, 0.75, 1] } : { opacity: 1 }}
          transition={shownKind === 'trap' && full ? { repeat: Infinity, duration: 1.2 } : {}}
        />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
          <span className={`hud-label ${compact ? 'hidden sm:inline' : ''}`}>Door {index + 1}</span>
          <kbd>{index + 1}</kbd>
        </div>

        <div className="absolute inset-x-0 top-[30%] flex justify-center">
          <motion.span
            className="text-4xl sm:text-5xl"
            style={{ color: style.color, textShadow: `0 0 18px ${style.color}` }}
            animate={full ? { y: [0, -4, 0] } : { y: 0 }}
            transition={full ? { repeat: Infinity, duration: 2.4, delay: index * 0.3 } : {}}
          >
            {style.icon}
          </motion.span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-wider px-1.5" style={{ color: style.color, border: `1px solid ${style.color}66` }}>
              {door.revealed ? '✓ ' : ''}{label}
            </span>
            <SignalBars color={style.color} strength={strength} animate={full} />
          </div>
          <p className="mt-1 text-xs sm:text-sm leading-snug text-slate-200">{line}</p>
        </div>

        <div className="holo-sheen" />
        {corrupted && <div className="corrupt-overlay" />}
      </motion.button>
    </motion.div>
  );
});

export default DoorCard;
