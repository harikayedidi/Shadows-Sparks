import { motion } from 'framer-motion';

const HealthBar = ({ health, maxHealth }) => {
  return (
    <div className="health-bar">
      {[...Array(maxHealth)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 1 }}
          animate={{ 
            scale: i < health ? 1 : 0.8,
            opacity: i < health ? 1 : 0.5 
          }}
          className={i < health ? "text-red-500" : "text-gray-500"}
        >
          ❤️
        </motion.span>
      ))}
    </div>
  );
};

export default HealthBar;