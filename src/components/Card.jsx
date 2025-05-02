import { motion } from 'framer-motion';
import { cardTypeColors } from '../data/themes';

const Card = ({ card, isFlipped, isVictory, isDefeat, theme = {} }) => {  // Add default empty object for theme
  if (!card) return null;

  const getCardStyle = () => {
    if (isVictory) {
      return {
        glow: '0 0 30px #86efac',
        border: '#86efac60',
        background: theme?.background || 'linear-gradient(to bottom, #1a1a2e, #162447)',
        animation: 'pulse 2s infinite'
      };
    }
    
    if (isDefeat) {
      return {
        glow: '0 0 30px #ef4444',
        border: '#ef444460',
        background: theme?.background || 'linear-gradient(to bottom, #1a1a2e, #162447)',
        animation: 'flicker 2s infinite'
      };
    }

    // Use theme-specific card styles if available
    const themeStyle = theme?.cardStyles?.[card.type];
    if (themeStyle) {
      return themeStyle;
    }

    // Fallback to default card type colors
    const typeColor = cardTypeColors[card.type] || cardTypeColors.darkRoom;
    const glowEffects = {
      lightTrap: 'shadow-[0_0_16px_white]',
      darkRoom: 'shadow-[0_0_12px_#333]',
      special: 'shadow-yellow-400',
      inventory: 'animate-pulse shadow-[0_0_12px_#4f46e5]'
    };

    return {
      glow: card.type === 'inventory'
        ? '0 0 12px rgb(79, 70, 229)'
        : card.type === 'special'
        ? '0 0 16px #eab308'
        : card.type === 'lightTrap'
        ? '0 0 16px white'
        : card.type === 'darkRoom'
        ? '0 0 12px #333'
        : typeColor.glow,
      border: `${typeColor.base}60`,
      background: theme?.background || 'linear-gradient(to bottom, #1a1a2e, #162447)',
      animation: card.type === 'inventory'
        ? 'pulse 2s infinite'
        : card.type === 'special'
        ? 'special-card-glow 3s infinite'
        : 'none',
      className: glowEffects[card.type] || ''
    };
  };

  const cardStyle = getCardStyle();

  return (
    <motion.div
      className={`
        relative rounded-xl shadow-xl card-reveal
        ${isFlipped ? 'cursor-default' : 'cursor-pointer'}
        ${card.type === 'special' ? 'special-effect' : ''}
        ${card.type === 'lightTrap' ? 'light-trap' : ''}
        ${card.type === 'darkRoom' ? 'dark-room' : ''}
      `}
      style={{
        width: 'var(--card-width)',
        height: 'var(--card-height)',
        transformStyle: 'preserve-3d'
      }}
      initial={{
        opacity: 50,
        scale: 0.8,
        x: -220, // Start from deck's horizontal position
        y: -20  // Start from above the reveal position
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1] // Custom easing for smoother fall
        }
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.2
        }
      }}
    >
      {/* Card Front */}
      <motion.div
        className={`
          absolute inset-0 rounded-xl bg-opacity-90
          ${cardStyle.className || ''}
        `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{
          boxShadow: cardStyle.glow,
          border: `2px solid ${cardStyle.border}`,
          background: cardStyle.background,
          animation: cardStyle.animation
        }}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Card Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-2 sm:mb-4 text-white">
            {card.title}
          </h3>

          {/* Card Type Icon */}
          <div className={`text-4xl text-center mb-4 ${card.type === 'special' ? 'special-icon' : ''}`}>
            {card.type === 'lightTrap' && '🔦'}
            {card.type === 'darkRoom' && '🌑'}
            {card.type === 'special' && (
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                  opacity: [1, 0.8, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🌈
              </motion.span>
            )}
            {card.type === 'choice' && '🟡'}
          </div>

          {/* Card Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 text-center flex-grow">
            {card.description}
          </p>

          {/* Card Effects */}
          {card.damage && (
            <div 
              className="mt-4 text-center font-medium" 
              style={{ color: theme?.cardStyles?.lightTrap?.border || '#ffffff80' }}
            >
              Damage: {card.damage}
            </div>
          )}

          {card.hasChoice && (
            <div 
              className="mt-4 text-center font-medium"
              style={{ color: theme?.cardStyles?.choice?.border || '#fcd34d80' }}
            >
              Choose your action...
            </div>
          )}

          {card.effect && !card.hasChoice && (
            <div 
              className="mt-4 text-center font-medium"
              style={{ color: theme?.cardStyles?.special?.border || '#60a5fa80' }}
            >
              Special Effect
            </div>
          )}
        </div>
      </motion.div>

      {/* Card Back */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          background: theme?.cardBack ? `url(${theme.cardBack}) center/cover` : '#1a1a2e',
          border: `2px solid ${theme?.borderColor || '#ffffff'}80`,
          boxShadow: `0 0 15px ${theme?.particleColor || '#ffffff'}40`
        }}
      >
        <div className="absolute inset-2 rounded-lg border-2 border-gray-600/30">
          <div
            className="absolute inset-0 rounded-lg opacity-30"
            style={{
              background: `radial-gradient(circle at center, ${theme?.particleColor || '#ffffff'}, transparent)`
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Card;