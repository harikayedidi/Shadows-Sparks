import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

const HEX = 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)';

// Health readout. Also the drop target for dragged items.
const IntegrityBar = forwardRef(function IntegrityBar({ hp, max, pulse, dropActive, accent }, ref) {
  const { full } = useSettings();
  const critical = hp <= 2;
  const blink = critical && full;
  const color = critical ? '#ff3c5a' : 'var(--accent)';

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col gap-1 px-3 py-2"
      animate={dropActive ? { scale: 1.06 } : { scale: 1 }}
      style={{
        outline: dropActive ? '1px dashed var(--accent)' : '1px dashed transparent',
        background: dropActive ? 'var(--accent-soft)' : 'transparent',
      }}
      aria-label={`Health ${hp} of ${max}`}
      role="meter"
      aria-valuenow={hp}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <span className="hud-label">{dropActive ? 'Let go to use' : `Health ${hp}/${max}`}</span>
      <div className="flex gap-1.5">
        {Array.from({ length: max }, (_, i) => {
          const filled = i < hp;
          return (
            <motion.div
              key={`${i}-${pulse?.type === 'damage' || pulse?.type === 'heal' ? pulse.id : 0}`}
              className="w-8 h-9"
              style={{
                clipPath: HEX,
                boxShadow: filled ? `0 0 14px ${color}` : 'none',
              }}
              initial={
                pulse?.type === 'damage' && i >= hp && i < hp + pulse.amount
                  ? { scale: 1.5, background: '#ffffff' }
                  : pulse?.type === 'heal' && filled && i >= hp - pulse.amount
                    ? { scale: 0.4 }
                    : false
              }
              animate={{
                scale: 1,
                background: filled ? (critical ? '#ff3c5a' : accent) : 'rgba(255,255,255,0.06)',
                opacity: filled ? (blink ? [1, 0.55, 1] : 1) : 0.6,
              }}
              transition={blink && filled ? { opacity: { repeat: Infinity, duration: 0.9 } } : { duration: 0.45 }}
            />
          );
        })}
      </div>
    </motion.div>
  );
});

export default IntegrityBar;
