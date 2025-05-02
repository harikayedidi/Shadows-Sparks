import { motion } from 'framer-motion';

const DeckStack = ({ count, theme, onDrawCard, isDisabled, isEndless }) => {
  const handleClick = (e) => {
    if (!isDisabled) {
      onDrawCard();
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
      e.preventDefault();
      onDrawCard();
    }
  };

  return (
    <div className="relative w-full h-full group cursor-pointer touch-none">
      {/* Stack visualization - max 4 cards */}
      {[...Array(Math.min(4, count))].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 transition-all duration-300"
          initial={false}
          style={{
            left: `${i * 4}px`,
            top: `${i * 3}px`,
            transform: `rotate(${i * -2}deg)`,
            zIndex: i
          }}
        >
          <div
            className="rounded-xl transform transition-all duration-300 group-hover:shadow-xl"
            style={{
              width: 'var(--card-width)',
              height: 'var(--card-height)',
              background: `url(${theme.cardBack}) center/cover`,
              border: `2px solid ${theme.borderColor}60`,
              boxShadow: `0 0 10px ${theme.particleColor}40`
            }}
          />
        </motion.div>
      ))}

      {/* Interactive top card */}
      <motion.button
        className={`
          rounded-xl relative z-10
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          transition-all duration-300 ease-out
          hover:shadow-2xl hover:shadow-blue-500/20
          touch-none
        `}
        style={{
          width: 'var(--card-width)',
          height: 'var(--card-height)',
          background: `url(${theme.cardBack}) center/cover`,
          border: `2px solid ${theme.borderColor}60`,
          boxShadow: `0 0 15px ${theme.particleColor}40`,
          WebkitTapHighlightColor: 'transparent'
        }}
        disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onTouchStart={(e) => e.stopPropagation()}
        whileHover={isDisabled ? {} : { scale: 1.05 }}
        whileTap={isDisabled ? {} : {
          scale: 0.95,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 20
          }
        }}
        initial={false}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-label={isEndless ? 'Draw card' : `Draw card (${count} remaining)`}
        aria-disabled={isDisabled}
      >
        {/* Card Count Badge */}
        {count > 0 && !isEndless && (
          <div
            className="absolute -top-3 -right-3 px-2.5 py-1.5 rounded-full text-xl font-medium
                      backdrop-blur-sm shadow-lg transform transition-all group-hover:scale-110"
            style={{
              background: theme.background || 'linear-gradient(to bottom, #1a1a2e, #162447)',
              border: `2px solid ${theme.borderColor}60`,
              color: theme.borderColor
            }}
            aria-hidden="true"
          >
            {count}
          </div>
        )}
        
        {/* Inner glow effect */}
        <motion.div
          className="absolute inset-2 rounded-xl opacity-40"
          initial={false}
          animate={{
            opacity: isDisabled ? 0.1 : [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `radial-gradient(circle at center, ${theme.particleColor}, transparent)`
            }}
          />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default DeckStack;