import { motion, AnimatePresence } from 'framer-motion';

const GameLog = ({ messages }) => {
  return (
    <div className="mt-4 h-48 w-full max-w-xl mx-auto overflow-y-auto rounded-lg bg-gray-800 p-6 border border-gray-700">
      <div className="space-y-3">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`${
                index < 3 ? 'text-lg font-medium' : 'text-gray-300'
              } ${index === 0 ? 'text-xl text-yellow-400 font-bold' : ''}`}
            >
              {message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameLog;