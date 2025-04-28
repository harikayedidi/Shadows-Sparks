import { motion } from 'framer-motion';

const Card = ({ card, isFlipped, onClick }) => {
  const cardVariants = {
    hidden: { 
      rotateY: 0,
      transition: { duration: 0.6 }
    },
    visible: { 
      rotateY: 360,
      transition: { duration: 0.6 }
    }
  };

  const getCardClass = () => {
    const baseClass = 'card-base';
    if (!card) return `${baseClass} bg-gray-700 text-gray-500`;
    
    // Determine card background color based on type and effect
    if (card.type === 'light' || (card.type === 'event' && card.description.includes('damage'))) {
      return `${baseClass} bg-red-500 text-white`;
    }
    if (card.type === 'dark') {
      return `${baseClass} card-dark`;
    }
    return `${baseClass} card-special`;
  };

  if (!card) {
    return (
      <div className="card-base bg-gray-700 text-gray-500 flex items-center justify-center">
        Draw a card
      </div>
    );
  }

  return (
    <motion.div
      className={getCardClass()}
      initial="hidden"
      animate={isFlipped ? "visible" : "hidden"}
      variants={cardVariants}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      style={{ backfaceVisibility: 'visible' }}
    >
      <h2 className="text-xl font-bold mb-4">{card.title}</h2>
      <p className="text-center">{card.description}</p>
      {card.type === 'item' && (
        <div className="mt-4 text-sm italic">
          Click to use from inventory
        </div>
      )}
    </motion.div>
  );
};

export default Card;