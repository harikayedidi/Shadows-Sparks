import { motion } from 'framer-motion';

const DrawCounter = ({ current, total, theme }) => {
  return (
    <motion.div 
      className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                 px-4 py-2 rounded-full backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: theme?.background || 'linear-gradient(to bottom, #1a1a2e, #162447)',
        border: `2px solid ${theme?.borderColor}60` || 'border-gray-700',
        boxShadow: theme?.titleGlow || '0 0 20px rgba(255,255,255,0.1)'
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-400">
          Cards Remaining:
        </span>
        <span 
          className="text-lg font-bold"
          style={{ color: theme?.borderColor || 'white' }}
        >
          {current}
        </span>
        <span className="text-sm text-gray-500">
          / {total}
        </span>
      </div>
    </motion.div>
  );
};

export default DrawCounter;