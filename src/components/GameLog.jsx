import { motion, AnimatePresence } from 'framer-motion';

const GameLog = ({ messages }) => {
  return (
    <div className="mt-4 h-32 overflow-y-auto rounded-lg bg-gray-800 p-4">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-gray-300 mb-2"
          >
            {message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GameLog;