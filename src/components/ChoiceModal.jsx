import { motion, AnimatePresence } from 'framer-motion';

const ChoiceModal = ({ isOpen, onClose, onSkip, onSave }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="choice-title"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-xl max-w-sm w-full border-2 border-yellow-500/30"
          >
            <div className="bg-yellow-500/10 rounded-lg p-4 mb-6">
              <h2 
                id="choice-title" 
                className="text-xl font-bold mb-2 text-center text-yellow-400"
              >
                Special Choice Moment!
              </h2>
              
              <p className="text-gray-300 text-center text-sm">
                Choose your next move carefully. This is a rare opportunity to control your fate!
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <button
                  onClick={onSkip}
                  className="w-full game-button bg-blue-600 hover:bg-blue-700 group"
                  aria-label="Skip next card"
                >
                  <div className="text-lg font-bold mb-1">Skip Next Card</div>
                  <span className="block text-sm text-blue-200 group-hover:text-blue-100">
                    Safely skip the next card (lose a turn)
                  </span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 opacity-20 blur-lg" />
                  <button
                    onClick={onSave}
                    className="w-full game-button bg-gradient-to-r from-yellow-600 to-purple-600 hover:from-yellow-500 hover:to-purple-500 relative group"
                    aria-label="Try to save next card"
                  >
                    <div className="text-lg font-bold mb-1">Save Next Card</div>
                    <span className="block text-sm text-yellow-200 group-hover:text-yellow-100">
                      Peek & save if it's a power card (risk losing a turn)
                    </span>
                  </button>
                </div>
              </div>

              <p className="text-center text-sm text-gray-300 italic">
                This choice won't appear again until your next adventure
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChoiceModal;