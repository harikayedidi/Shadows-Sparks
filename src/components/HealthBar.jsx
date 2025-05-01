import { motion } from 'framer-motion';

const HealthBar = ({ health, maxHealth }) => {
  return (
    <div className="inline-flex items-center justify-center my-8">
      <div className="text-2xl tracking-wider font-medium text-white font-sans mr-3">HP</div>
      <div className="flex gap-3">
        {[...Array(maxHealth)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 1 }}
            animate={{
              scale: i < health ? 1 : 0.8,
              opacity: i < health ? 1 : 0.5
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className={`text-4xl transition-all duration-500 transform ${
              i < health
                ? "text-red-500 hover:scale-110 opacity-100"
                : "text-gray-400 opacity-40"
            }`}
          >
            ❤️
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default HealthBar;