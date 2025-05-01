import { motion } from 'framer-motion';

export const Instructions = ({ isVisible, onToggle }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      id="game-instructions"
      className="w-full max-w-2xl mx-auto bg-gray-900/90 rounded-lg p-6 mb-6 backdrop-blur"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      role="region"
      aria-label="Game Instructions"
    >
      {/* Game Description */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-200 mb-2">
          How to Play
        </h2>
        <p className="text-gray-400 text-sm">
          Draw, decide, and survive 10 rounds of risk.
        </p>
      </div>

      {/* Core Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h3 className="font-bold text-gray-200 mb-2">Starting Resources</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• 5 lives (HP)</li>
            <li>• 10 cards per round</li>
            <li>• 2 Special Cards to discover</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-200 mb-2">Card Types</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-center gap-2">
              <span>🔦</span> Light Traps - Deal damage
            </li>
            <li className="flex items-center gap-2">
              <span>🌑</span> Dark Rooms - Safe passage
            </li>
            <li className="flex items-center gap-2">
              <span>🌈</span> Special Cards - Storable items
            </li>
            <li className="flex items-center gap-2">
              <span>🟡</span> Choice Cards - Pick your path
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-200 mb-2">Victory Conditions</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• Survive 10 card draws</li>
            <li>• Keep HP above 0</li>
            <li>• Win to unlock Endless Mode</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-200 mb-2">Tips</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• Use special items wisely</li>
            <li>• Save HP for later rounds</li>
            <li>• Consider each choice carefully</li>
          </ul>
        </section>
      </div>
    </motion.div>
  );
};

export default Instructions;