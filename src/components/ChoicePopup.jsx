import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const ChoicePopup = ({ isOpen, title, description, choices, onChoice }) => {
  // Handle keyboard interactions
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      if (!choices || choices.length === 0) return;

      // Number keys 1-2 for choices
      if (e.key === '1' && choices[0]) {
        onChoice(choices[0]);
      } else if (e.key === '2' && choices[1]) {
        onChoice(choices[1]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, choices, onChoice]);

  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen) return;

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
    firstFocusable?.focus();

    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="choice-title"
      className="bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl w-full transform-gpu overflow-hidden"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="p-6">
        <h3 id="choice-title" className="text-xl font-bold mb-4 text-center text-yellow-400">
          {title}
        </h3>
        {description && (
          <p className="text-gray-300 text-center mb-6">{description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {choices.map((choice, index) => (
            <motion.button
              key={index}
              onClick={() => onChoice(choice)}
              className={`
                relative px-4 py-3 rounded-lg font-medium
                transition-all duration-200
                ${choice.style === 'safe' 
                  ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' 
                  : choice.style === 'special'
                  ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                  : 'bg-red-600 hover:bg-red-700 active:bg-red-800'} 
                text-white shadow-lg hover:shadow-xl
                min-h-[4rem] flex flex-col items-center justify-center
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`${choice.label}${choice.subtext ? ` - ${choice.subtext}` : ''}`}
            >
              <span className="text-lg">{choice.label}</span>
              {choice.subtext && (
                <span className="text-sm opacity-80 mt-1 group-hover:opacity-100">
                  {choice.subtext}
                </span>
              )}
              {/* Optional keyboard shortcut hint */}
              <span className="absolute bottom-1 right-2 text-xs opacity-50">
                {index + 1}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ChoicePopup;