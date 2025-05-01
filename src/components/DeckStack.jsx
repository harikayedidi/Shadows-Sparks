import { motion } from 'framer-motion';

const DeckStack = ({ count, theme, onDrawCard, isDisabled, isEndless }) => {
  const handleInteraction = (e) => {
    e.preventDefault();
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
    <div className="relative deck-scale">
      {/* Stack visualization - max 4 cards */}
      {[...Array(Math.min(4, count))].map((_, i) => (
        <div
          key={i}
          className="absolute transition-all duration-300"
          style={{
            left: `${i * 3}px`,
            top: `${i * 2}px`,
            transform: `rotate(${i * -2}deg)`,
            zIndex: i
          }}
        >
          <div
            className="w-36 h-48 rounded-lg transform transition-all duration-300"
            style={{
              background: `url(${theme.cardBack}) center/cover`,
              border: `2px solid ${theme.borderColor}60`,
              boxShadow: `0 0 10px ${theme.particleColor}40`
            }}
          />
        </div>
      ))}

      {/* Interactive top card */}
      <motion.button
        className={`
          w-36 h-48 sm:w-36 sm:h-48 rounded-lg relative z-10
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
        `}
        disabled={isDisabled}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        onKeyDown={handleKeyDown}
        whileHover={isDisabled ? {} : { scale: 1.1 }}
        whileTap={isDisabled ? {} : { scale: 0.98 }}
        style={{
          background: `url(${theme.cardBack}) center/cover`,
          border: `2px solid ${theme.borderColor}60`,
          boxShadow: `0 0 15px ${theme.particleColor}40`,
          WebkitTapHighlightColor: 'transparent'
        }}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-label={isEndless ? 'Draw card' : `Draw card (${count} remaining)`}
        aria-disabled={isDisabled}
      >
        {/* Card Count Badge */}
        {count > 0 && !isEndless && (
          <div 
            className="absolute -top-2 -right-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-2xl sm:text-xl font-medium
                      backdrop-blur-sm shadow-lg"
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
        <div className="absolute inset-1.5 sm:inset-2 rounded-lg opacity-30">
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `radial-gradient(circle at center, ${theme.particleColor}, transparent)`
            }}
          />
        </div>
      </motion.button>
    </div>
  );
};

export default DeckStack;