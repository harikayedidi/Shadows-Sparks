import { motion } from 'framer-motion';
import Card from './Card';

const InventorySlot = ({ item, onUseItem, slotNumber }) => {
  const handleClick = () => {
    if (item) {
      onUseItem(item, slotNumber);
    }
  };

  return (
    <motion.div
      className={`inventory-slot ${item ? 'cursor-pointer' : 'bg-gray-800'}`}
      whileHover={item ? { scale: 1.05 } : {}}
      onClick={handleClick}
    >
      {item ? (
        <div className="transform scale-50">
          <Card card={item} isFlipped={true} />
        </div>
      ) : (
        <span className="text-gray-500">Empty</span>
      )}
    </motion.div>
  );
};

export default InventorySlot;