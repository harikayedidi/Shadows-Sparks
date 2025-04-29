import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const ChoicePopup = ({ isOpen, title, description, choices, onChoice, peeksRemaining }) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen && choices.length > 0) {
        onChoice(choices[0].action); // Default to first choice on escape
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, choices, onChoice]);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen) {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstFocusable.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="choice-title"
          className="bg-gray-800/95 rounded-xl shadow-2xl w-full max-w-sm mx-auto p-6 relative"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <h3 id="choice-title" className="text-xl font-bold mb-2 text-center text-yellow-400">
            {title}
          </h3>
          <p className="text-gray-300 text-center mb-6">{description}</p>
          
          <div className="flex flex-col gap-3">
            {choices.map((choice, index) => (
              <motion.button
                key={index}
                onClick={() => onChoice(choice.action)}
                className={`
                  group relative w-full px-4 py-3 rounded-lg font-medium 
                  transition-all duration-200 
                  ${choice.style === 'safe' 
                    ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' 
                    : choice.style === 'special'
                    ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                    : 'bg-red-600 hover:bg-red-700 active:bg-red-800'} 
                  text-white shadow-lg hover:shadow-xl
                  active:shadow-md active:translate-y-px
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                aria-label={choice.label}
                disabled={choice.action === 'peek' && peeksRemaining === 0}
              >
                {choice.label}
                {choice.subtext && (
                  <span className="block text-sm opacity-80 mt-1 group-hover:opacity-100">
                    {choice.subtext}
                  </span>
                )}
                {choice.action === 'peek' && peeksRemaining !== undefined && (
                  <span className="absolute top-1 right-2 text-xs opacity-70">
                    {peeksRemaining} left
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChoicePopup;