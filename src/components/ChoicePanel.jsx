import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const ChoicePanel = forwardRef(function ChoicePanel({ card, hasItems, onChoose }, ref) {
  return (
    <motion.section
      ref={ref}
      data-pick
      className="panel p-4 sm:p-5 w-[min(24rem,92vw)]"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
      exit={{ opacity: 0, x: 20 }}
      aria-label={`${card.title}: choose`}
    >
      <p className="hud-label" style={{ color: '#c18bff' }}>◈ Event · pick one</p>
      <h3 className="font-display text-lg mt-1 text-white">{card.title}</h3>
      <div className="mt-4 flex flex-col gap-2">
        {card.options.map((option, i) => {
          const disabled = option.requiresItem && !hasItems;
          return (
            <motion.button
              key={option.label}
              className="btn-ghost !normal-case !tracking-normal text-left !font-sans !text-base flex items-start gap-3"
              onClick={() => onChoose(i)}
              disabled={disabled}
              whileHover={disabled ? undefined : { x: 4 }}
            >
              <kbd className="mt-0.5">{i + 1}</kbd>
              <span>
                <span className="block font-semibold text-white">{option.label}</span>
                <span className="block text-sm text-slate-300">{disabled ? 'You have no items to trade.' : option.hint}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
});

export default ChoicePanel;
