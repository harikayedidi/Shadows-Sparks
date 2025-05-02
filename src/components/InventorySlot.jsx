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
        inventory-slot group relative p-2 sm:p-3 rounded-lg
        ${item ? 'cursor-pointer inventory-item' : 'bg-gray-800/60'}
        focus-within:ring-2 focus-within:ring-blue-400/50
        transition-all duration-300 ease-in-out
        w-36 h-48 sm:w-44 sm:h-56 md:w-44 md:h-56
        backdrop-blur-sm
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

      {/* Content */}
      {item ? (
        <motion.div
          className="relative z-10 transform scale-50 sm:scale-75"
          initial={{ scale: 0.5 }}
          whileHover={{ scale: 0.6 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="relative">
            <Card card={item} isFlipped={true} />
            <div className="absolute -top-3 left-0 right-0 text-center">
              {/* <span className="px-2 py-1 bg-gray-900/90 rounded text-[10px] sm:text-xs font-medium text-white"> */}
                {/* {item.title} */}
              {/* </span> */}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
          <span className="text-gray-500 text-sm sm:text-base md:text-lg">Empty</span>
          <span className="text-gray-600 text-xs sm:text-sm md:text-base">Slot {slotNumber + 1}</span>
        </div>
      )}

      {/* Interaction hint */}
      {item && (
        <motion.div
          className="absolute bottom-2 sm:bottom-3 left-0 right-0 text-center text-xs sm:text-sm text-yellow-400/80 font-medium mt-2"
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