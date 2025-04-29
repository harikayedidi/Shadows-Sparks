import { motion } from 'framer-motion';
import Card from './Card';

const InventorySlot = ({ item, onUseItem, slotNumber }) => {
  const handleClick = () => {
    if (item) {
      onUseItem(item, slotNumber);
    }
  };

  const handleKeyPress = (e) => {
    if (item && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onUseItem(item, slotNumber);
    }
  };

  return (
    <motion.div
      className={`
        inventory-slot group relative
        ${item ? 'cursor-pointer hover:ring-2 hover:ring-yellow-400/50' : 'bg-gray-800/60'}
        focus-within:ring-2 focus-within:ring-blue-400
      `}
      whileHover={item ? { scale: 1.05 } : {}}
      whileTap={item ? { scale: 0.95 } : {}}
      onClick={handleClick}
      role={item ? "button" : "region"}
      tabIndex={item ? 0 : -1}
      onKeyDown={handleKeyPress}
      aria-label={item ? `Use ${item.title} from inventory slot ${slotNumber}` : `Empty inventory slot ${slotNumber}`}
    >
      {/* Glow effect for items */}
      {item && (
        <motion.div
          className="absolute inset-0 bg-yellow-400/20 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Content */}
      {item ? (
        <motion.div 
          className="transform scale-50 relative z-10"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: [-1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Card card={item} isFlipped={true} />
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          <span className="text-gray-500 text-sm">Empty</span>
          <span className="text-gray-600 text-xs">Slot {slotNumber}</span>
        </div>
      )}

      {/* Interaction hint */}
      {item && (
        <motion.div
          className="absolute bottom-1 left-0 right-0 text-center text-xs text-yellow-400/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Click to use
        </motion.div>
      )}
    </motion.div>
  );
};

export default InventorySlot;