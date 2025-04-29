import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

const GameLog = ({ messages }) => {
  const scrollContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  return (
    <motion.div 
      className="game-log"
      role="log"
      aria-label="Game events log"
      aria-live="polite"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-300">Game Events</h3>
        <span className="text-sm text-gray-500">{messages.length} events</span>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="space-y-2 overflow-y-auto pr-2 custom-scrollbar"
        style={{ maxHeight: 'calc(100vh - 500px)', minHeight: '12rem' }}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={`${index}-${message}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              className={`
                py-2 px-3 rounded
                transform transition-colors duration-200
                ${index === messages.length - 1 
                  ? 'bg-gray-700 shadow-lg scale-100' 
                  : 'bg-gray-800/80 scale-98'}
                ${message.includes('damage') || message.includes('DANGER') 
                  ? 'border-l-4 border-red-500' 
                  : message.includes('heal') || message.includes('safe')
                  ? 'border-l-4 border-green-500'
                  : message.includes('item') || message.includes('Victory')
                  ? 'border-l-4 border-yellow-400'
                  : message.includes('Special')
                  ? 'border-l-4 border-purple-500'
                  : 'border-l-4 border-gray-600'}
              `}
            >
              <p className="text-sm md:text-base">
                {message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GameLog;