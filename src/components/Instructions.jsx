import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Instructions = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 mb-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium 
                  transition-colors duration-200 flex items-center justify-center gap-2"
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
        aria-controls="instructions-panel"
      >
        {isOpen ? 'Hide Instructions' : 'Show Instructions'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="instructions-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-yellow-400">How to Play</h2>
              <div className="space-y-4">
                <section>
                  <h3 className="font-bold mb-2 text-gray-200">Goal</h3>
                  <p className="text-gray-300">Survive 10 rounds without losing all HP.</p>
                </section>

                <section>
                  <h3 className="font-bold mb-2 text-gray-200">Card Types</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                      <span className="text-gray-300">Safe passage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
                      <span className="text-gray-300">Dangerous traps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
                      <span className="text-gray-300">Usable items</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-pulse" />
                      <span className="text-gray-300">Special encounters</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold mb-2 text-gray-200">Health & Inventory</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                    <li>Start with 5 HP (Health Points)</li>
                    <li>Can hold up to 2 items at once</li>
                    <li>Click items in inventory to use them</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold mb-2 text-gray-200">Tips</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                    <li>Watch for red glowing cards</li>
                    <li>Keep healing items for emergencies</li>
                    <li>Plan your moves carefully</li>
                  </ul>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Instructions;