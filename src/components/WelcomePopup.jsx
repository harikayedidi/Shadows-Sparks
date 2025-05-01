import { motion } from 'framer-motion';

const WelcomePopup = ({ isOpen, onClose }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 items-center p-4 pointer-events-auto
                min-h-screen flex flex-col justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <motion.div
        className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full border border-gray-700 relative
                  text-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <h2 
          id="welcome-title"
          className="text-4xl md:text-6xl font-bold text-gray-100 mb-6 text-center"
        >
          🃏 Welcome to Shadows & Sparks!
        </h2>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <p className="text-xl md:text-2xl font-medium mb-2">
              🎯 Your goal: Survive 10 card draws with 5 HP.
            </p>
            <p className="text-gray-400">
              🎴 Some cards are traps, some are safe, and others offer powerful choices or items.
            </p>
          </section>

          <section>
            <h3 className="font-medium mb-2">❤️ You start with:</h3>
            <ul className="list-inside space-y-1 text-gray-400">
              <li>- 5 lives (HP)</li>
              <li>- 10 cards per round</li>
              <li>- 2 Special Cards to discover and use wisely</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-medium mb-4">Card Types:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-400">
              <li>🟡 Choice Cards let you decide</li>
              <li>🌈 Special Cards can be saved and played later</li>
              <li>🔦 Light Traps hurt</li>
              <li>🌑 Dark Rooms are safe</li>
            </div>
          </section>

          <p className="font-medium text-yellow-400/80">
            🏆 Win a round to unlock Endless Mode!
          </p>

          <p className="text-gray-400 italic">
            Good luck in the dark.
          </p>

          <p className="text-sm text-gray-500 mb-2">
            Tip: You can choose a visual theme below the Draw Card button before starting.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <motion.button
            className="btn-primary w-full"
            onClick={onClose}
            onTouchStart={onClose}
            onKeyDown={handleKeyDown}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            role="button"
            tabIndex={0}
            aria-label="Start playing the game"
          >
            Got it, let's play!
          </motion.button>

          {/* Mobile-friendly tip */}
          <div className="text-center text-sm text-gray-500">
            Tap button or press Enter/Space to start
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomePopup;