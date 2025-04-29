import { motion } from 'framer-motion';

const Card = ({ card, isFlipped, isVictory, isDefeat }) => {
  const cardVariants = {
    hidden: { 
      rotateY: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    visible: { 
      rotateY: 360,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
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

  const getCardClass = () => {
    if (!card) {
      return 'card-base bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400';
    }

    const baseClass = 'card-base relative overflow-hidden';
    const glowStyles = {
      dark: 'bg-gradient-to-br from-green-600 to-green-500 shadow-[0_0_25px_rgba(34,197,94,0.3)]',
      light: 'bg-gradient-to-br from-red-600 to-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)]',
      item: 'bg-gradient-to-br from-yellow-500 to-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.3)]',
      event: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 shadow-[0_0_25px_rgba(168,85,247,0.3)] animate-gradient'
    };

    return `${baseClass} ${glowStyles[card.type] || ''}`;
  };

  if (!card) {
    return (
      <motion.div 
        className="card-base bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400 
                   flex items-center justify-center cursor-pointer"
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

  return (
    <motion.div
      className={getCardClass()}
      initial="hidden"
      animate={animate}
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        backfaceVisibility: 'visible',
        transformStyle: 'preserve-3d'
      }}
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