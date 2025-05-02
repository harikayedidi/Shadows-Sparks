import { motion } from 'framer-motion';
import themes from '../data/themes';

export const ThemeSelector = ({ currentTheme, onSelectTheme, isOpen, onToggle }) => {
  const handleKeyDown = (e, theme) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectTheme(theme);
    }
  };

  const handleInteraction = (e, theme) => {
    e.preventDefault();
    onSelectTheme(theme);
  };

  return (
    <div
      className="flex flex-col my-4 items-center justify-center"
      role="region"
      aria-label="Theme Selection"
    >
      <motion.button
        onClick={onToggle}
        className="btn-custom px-4 py-3
                   backdrop-blur rounded-lg text-gray-300 font-medium
                   transition-colors focus:outline-none focus:ring-2
                   focus:ring-white/20 flex items-center gap-2 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Change Theme</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto px-4 py-3 bg-gray-800/90 rounded-lg backdrop-blur shadow-xl">
        {Object.entries(themes).map(([key, theme]) => (
          <motion.button
            key={key}
            className={`
              p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50
              focus:ring-offset-2 focus:ring-offset-gray-900 transition-shadow
              ${currentTheme.name === theme.name 
                ? 'ring-2 ring-white/80' 
                : 'hover:ring-2 hover:ring-white/30'
              }
            `}
            style={{
              background: theme.background,
              boxShadow: `0 0 15px ${theme.particleColor}`,
              opacity: currentTheme.name === theme.name ? 1 : 0.7
            }}
            onClick={(e) => handleInteraction(e, theme)}
            onTouchStart={(e) => handleInteraction(e, theme)}
            onKeyDown={(e) => handleKeyDown(e, theme)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            role="radio"
            aria-checked={currentTheme.name === theme.name}
            tabIndex={0}
            aria-label={`Select ${theme.name} theme`}
          >
            <div className="flex flex-col items-center gap-2">
              <div 
                className="w-12 h-16 rounded overflow-hidden border border-white/20"
                style={{
                  background: `url(${theme.cardBack}) center/cover`
                }}
              />
              <span className="text-sm font-medium text-white text-center">
                {theme.name}
              </span>
            </div>
          </motion.button>
        ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ThemeSelector;