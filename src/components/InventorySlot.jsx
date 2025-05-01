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
        inventory-slot group relative p-3 rounded-lg
        ${item ? 'cursor-pointer hover:ring-2 hover:ring-yellow-400/50 inventory-item' : 'bg-gray-800/60'}
        focus-within:ring-2 focus-within:ring-blue-400
        transition-all duration-300 ease-in-out w-48 h-72
      `}
      whileHover={item ? { scale: 1.05 } : {}}
      whileTap={item ? { scale: 0.95 } : {}}
      onClick={handleClick}
      role={item ? "button" : "region"}
      tabIndex={item ? 0 : -1}
      onKeyDown={handleKeyPress}
      aria-label={item ? `Use ${item.title} from inventory slot ${slotNumber + 1}` : `Empty inventory slot ${slotNumber + 1}`}
    >
      {/* Special glow effect for special items */}
      {item && (
        <motion.div
          className={`absolute inset-0 rounded-lg ${
            item.type === 'special'
              ? 'special-effect'
              : 'bg-gradient-to-r from-yellow-400/30 to-amber-500/30'
          }`}
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
          className="relative z-10 transform scale-75"
          initial={{ scale: 0.75 }}
          whileHover={{ scale: 0.85 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative">
            <Card card={item} isFlipped={true} />
            <div className="absolute -top-3 left-0 right-0 text-center">
              <span className="px-2 py-1 bg-gray-900/90 rounded text-xs font-medium text-white">
                {item.title}
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
          <span className="text-gray-500 text-base md:text-lg">Empty</span>
          <span className="text-gray-600 text-sm md:text-base">Slot {slotNumber + 1}</span>
        </div>
      )}

      {/* Interaction hint */}
      {item && (
        <motion.div
          className="absolute bottom-3 left-0 right-0 text-center text-sm text-yellow-400/80 font-medium"
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