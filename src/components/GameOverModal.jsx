import { motion } from 'framer-motion';

const GameOverModal = ({
  isOpen,
  gameResult,
  isEndless,
  endlessStats,
  turns,
  onPlayAgain,
  onStartEndless
}) => {
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
    >
      <motion.div
        className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full border-2 border-gray-700"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <h2 
          id="game-over-title"
          className="text-2xl font-bold text-center mb-4"
          style={{ color: gameResult === 'victory' ? '#86efac' : '#fca5a5' }}
        >
          {gameResult === 'victory' ? 'Victory!' : 'Game Over'}
        </h2>

        <div className="space-y-4 text-gray-300 text-center mb-6">
          {isEndless ? (
            <div className="mt-4 p-4 rounded-lg bg-gray-800/50">
              <p className="text-2xl md:text-3xl font-bold mb-2">
                Rounds Survived: {turns} 🏆
              </p>
              <p className="text-sm text-gray-400">
                The darkness finally claims its prize...
              </p>
            </div>
          ) : (
            <>
              {gameResult === 'victory' ? (
                <p>You've mastered the shadows! 🌟</p>
              ) : (
                <p>The darkness claims another victim... 💀</p>
              )}
              <div className="mt-4 p-4 rounded-lg bg-gray-800/50">
                <p className="font-medium mb-2">Game Summary</p>
                <div className="text-sm space-y-1">
                  <p>Turns Survived: {turns}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4 pointer-events-auto">
          <motion.button
            className="btn-primary w-full"
            onClick={onPlayAgain}
            onTouchStart={onPlayAgain}
            onKeyDown={(e) => handleKeyDown(e, onPlayAgain)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            role="button"
            tabIndex={0}
            aria-label="Play again"
          >
            {isEndless ? 'Try Again' : 'Play Again'}
          </motion.button>

          {!isEndless && gameResult === 'victory' && (
            <>
              <div className="text-gray-400 text-sm text-center my-2">
                🏆 Congratulations! You've unlocked:
              </div>
              <motion.button
                className="btn-special w-full"
              onClick={onStartEndless}
              onTouchStart={onStartEndless}
              onKeyDown={(e) => handleKeyDown(e, onStartEndless)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              role="button"
              tabIndex={0}
              aria-label="Start endless mode"
            >
                Start Endless Mode
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile-friendly close hint */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Tap buttons or press Enter/Space to select
        </div>
      </motion.div>
    </div>
  );
};

export default GameOverModal;