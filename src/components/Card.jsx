import { motion } from 'framer-motion';

const Card = ({ card, isFlipped, isVictory, isDefeat, theme }) => {
  const cardVariants = {
    hidden: {
      y: 50,
      opacity: 0,
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }
    },
    victory: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 1,
        repeat: 1,
        ease: "easeInOut"
      }
    },
    defeat: {
      scale: [1, 0.9],
      opacity: [1, 0.7],
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const getCardStyles = () => {
    if (!card) {
      return {
        className: 'card-base bg-gray-900/80 backdrop-blur-sm border-2 border-gray-700 text-gray-400',
        style: {
          boxShadow: '0 0 15px rgba(75, 85, 99, 0.3)'
        }
      };
    }

    const baseClass = 'card-base relative overflow-hidden bg-black/40 backdrop-blur-sm';
    let borderColor = '';
    let shadowColor = '';

    const getThemeColors = () => {
      if (theme?.borderGlow) {
        switch (card.type) {
          case 'dark':
            return { color: theme.borderGlow.safe, opacity: 0.3 };
          case 'light':
            return { color: theme.borderGlow.trap, opacity: 0.3 };
          case 'item':
            return { color: theme.borderGlow.item, opacity: 0.3 };
          case 'event':
            return { special: true };
        }
      }
      // Fallback colors if no theme
      switch (card.type) {
        case 'dark':
          return { color: '#00ff9d', opacity: 0.3 };
        case 'light':
          return { color: '#ff4d4d', opacity: 0.3 };
        case 'item':
          return { color: '#ffd700', opacity: 0.3 };
        case 'event':
          return { special: true };
      }
    };

    const themeColors = getThemeColors();
    if (themeColors?.special) {
      return {
        className: `${baseClass} rainbow-border`,
        style: {
          border: '2px solid transparent'
        }
      };
    }

    if (themeColors) {
      borderColor = themeColors.color;
      shadowColor = themeColors.color;
    }

    return {
      className: baseClass,
      style: {
        border: `2px solid ${borderColor}`,
        boxShadow: `0 0 15px ${shadowColor}`
      }
    };
  };

  if (!card) {
    return (
      <motion.div
        className="card-base bg-gray-900/80 backdrop-blur-sm border-2 border-gray-700 text-gray-400
                   flex items-center justify-center cursor-pointer"
        style={{
          boxShadow: '0 0 15px rgba(75, 85, 99, 0.3)'
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        role="button"
        aria-label="Draw pile - click to draw a card"
        tabIndex={0}
      >
        <p className="text-center sm:text-sm md:text-base">Draw a card</p>
      </motion.div>
    );
  }

  const animate = isVictory ? "victory" : isDefeat ? "defeat" : isFlipped ? "visible" : "hidden";
  const cardStyles = getCardStyles();
  const combinedStyle = {
    ...cardStyles.style
  };

  return (
    <motion.div
      className={cardStyles.className}
      style={combinedStyle}
      initial="hidden"
      animate={animate}
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      role="article"
      aria-label={`${card.type} card: ${card.title}`}
    >
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-white">
        <motion.h2 
          className="text-xl font-bold mb-4 sm:text-2xl text-center"
          initial={false}
          animate={isVictory ? { 
            scale: [1, 1.1, 1], 
            transition: { repeat: Infinity, duration: 2 } 
          } : {}}
        >
          {card.title}
        </motion.h2>
        <p className="text-center sm:text-base md:text-lg">
          {card.description}
        </p>
        {card.type === 'item' && (
          <motion.div 
            className="mt-4 text-sm italic opacity-80"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click to use from inventory
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;