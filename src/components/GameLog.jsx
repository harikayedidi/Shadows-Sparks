import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

const GameLog = ({ messages }) => {
  const scrollContainerRef = useRef(null);
  const userScrollRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      
      // Always scroll to top for new messages
      requestAnimationFrame(() => {
        container.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      });
    }
  }, [messages]);

  // Track user scrolling - modified for top-first layout
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { scrollTop } = container;
      
      // Detect if user is scrolling down
      if (scrollTop > lastScrollTopRef.current) {
        userScrollRef.current = true;
      }
      
      // Reset when scrolled to top
      if (scrollTop === 0) {
        userScrollRef.current = false;
      }
      
      lastScrollTopRef.current = scrollTop;
    }
  };

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
        style={{
          maxHeight: 'min(calc(100vh - 500px), 24rem)',
          minHeight: '12rem'
        }}
        onScroll={handleScroll}
      >
        <AnimatePresence mode="popLayout">
          {[...messages].reverse().map((message, index) => (
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
                ${index === 0
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