import { motion } from 'framer-motion';

const CardBack = ({ index, total, theme }) => {
  // Calculate offset for stacked appearance
  const offset = index * 2;

  return (
    <motion.div
      className="absolute w-16 h-24 rounded-lg shadow-lg"
      style={{
        left: `${offset}px`,
        top: `${offset}px`,
        backgroundImage: `url(${theme?.cardBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `rotate(${index * 0.5}deg)`,
        zIndex: total - index
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    />
  );
};

const DeckStack = ({ count, theme }) => {
  return (
    <div className="relative w-24 h-32 mb-4">
      {[...Array(Math.min(count, 10))].map((_, i) => (
        <CardBack key={i} index={i} total={count} theme={theme} />
      ))}
    </div>
  );
};

export default DeckStack;