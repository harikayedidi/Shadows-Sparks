import { motion } from 'framer-motion';

const ChoicePopup = ({ description, choices, onChoice, onClose }) => {
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleChoice = (choice) => {
    if (onChoice) {
      onChoice(choice);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="choice-title"
    >
      <motion.div
        className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full border-2 border-gray-700"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="text-center space-y-6">
          {/* Description */}
          <div className="space-y-4">
            <h2 
              id="choice-title"
              className="text-2xl font-bold text-yellow-400"
            >
              Make Your Choice
            </h2>
            <p className="text-gray-300 text-lg">
              {description}
            </p>
          </div>

          {/* Choices */}
          <div className="space-y-4 mt-6">
            {choices.map((choice, index) => (
              <motion.button
                key={index}
                className={`
                  w-full py-4 px-6 rounded-lg text-left transition-colors
                  border-2 focus:outline-none focus:ring-2
                  focus:ring-offset-2 focus:ring-offset-gray-900
                  ${choice.disabled
                    ? 'bg-gray-900 border-gray-800 cursor-not-allowed opacity-60'
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-600 focus:ring-yellow-500'
                  }
                `}
                onClick={() => !choice.disabled && handleChoice(choice)}
                onKeyDown={(e) => !choice.disabled && handleKeyDown(e, () => handleChoice(choice))}
                whileHover={!choice.disabled ? { scale: 1.02 } : {}}
                whileTap={!choice.disabled ? { scale: 0.98 } : {}}
                disabled={choice.disabled}
                title={choice.disabledReason || ''}
                aria-disabled={choice.disabled}
              >
                <div className="space-y-2">
                  <h3 className={`text-lg font-bold ${choice.disabled ? 'text-gray-500' : 'text-yellow-400'}`}>
                    {choice.text}
                  </h3>
                  <p className={`text-sm ${choice.disabled ? 'text-gray-600' : 'text-gray-400'}`}>
                    {choice.disabled ? choice.disabledReason : choice.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Mobile Helper Text */}
          <p className="text-sm text-gray-500 mt-4">
            Tap a choice or use keyboard navigation
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ChoicePopup;