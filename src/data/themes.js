const themes = {
  frozen: {
    name: 'Frozen Crypts',
    borderColor: '#a3bffa',
    particleType: 'snow',
    particleColor: '#a3bffa',
    cardBack: '/images/frosty.png',
    cardBackground: 'linear-gradient(to bottom, #1f2937, #374151)',
    titleGlow: '0 0 30px #a3bffa40',
    cardStyles: {
      lightTrap: {
        glow: '0 0 20px #ffffff',
        border: '#ffffff90',
        background: 'linear-gradient(to bottom, #1f2937, #374151)',
        animation: 'flicker 2s infinite'
      },
      darkRoom: {
        glow: '0 0 15px #4b5563',
        border: '#4b556390',
        background: 'linear-gradient(to bottom, #1f2937, #374151)',
        animation: 'none'
      },
      special: {
        glow: '0 0 30px rgba(163, 191, 250, 0.5)',
        border: '#a3bffa60',
        background: 'linear-gradient(to bottom, #1a1a2e, #162447)',
        animation: 'pulse 2s infinite'
      },
      choice: {
        glow: '0 0 20px #fcd34d40',
        border: '#fcd34d60',
        background: 'linear-gradient(to bottom, #1a1a2e, #162447)',
        animation: 'none'
      }
    }
  },
  fire: {
    name: 'Ashen Depths',
    borderColor: '#f97316',
    particleType: 'ash',
    particleColor: '#f97316',
    cardBack: '/images/fire.png',
    cardBackground: 'linear-gradient(to bottom, #7c2d12, #991b1b)',
    titleGlow: '0 0 30px #f9731640',
    cardStyles: {
      lightTrap: {
        glow: '0 0 20px #ffffff',
        border: '#ffffff60',
        background: 'linear-gradient(to bottom, #1f1f1f, #2d1a1a)',
        animation: 'flicker 2s infinite'
      },
      darkRoom: {
        glow: 'none',
        border: '#1f1f1f60',
        background: 'linear-gradient(to bottom, #1f1f1f, #2d1a1a)',
        animation: 'none'
      },
      special: {
        glow: '0 0 30px rgba(249, 115, 22, 0.5)',
        border: '#f9731660',
        background: 'linear-gradient(to bottom, #1f1f1f, #2d1a1a)',
        animation: 'pulse 2s infinite'
      },
      choice: {
        glow: '0 0 20px #fcd34d40',
        border: '#fcd34d60',
        background: 'linear-gradient(to bottom, #1f1f1f, #2d1a1a)',
        animation: 'none'
      }
    }
  },
  garden: {
    name: 'Void Garden',
    borderColor: '#0d9488',
    particleType: 'spore',
    particleColor: '#0d9488',
    cardBack: '/images/garden.png',
    cardBackground: 'linear-gradient(to bottom, #064e3b, #065f46)',
    titleGlow: '0 0 30px #0d948840',
    cardStyles: {
      lightTrap: {
        glow: '0 0 20px #ffffff',
        border: '#ffffff60',
        background: 'linear-gradient(to bottom, #0d1b1b, #1a2f2f)',
        animation: 'flicker 2s infinite'
      },
      darkRoom: {
        glow: 'none',
        border: '#1f1f1f60',
        background: 'linear-gradient(to bottom, #0d1b1b, #1a2f2f)',
        animation: 'none'
      },
      special: {
        glow: '0 0 30px rgba(13, 148, 136, 0.5)',
        border: '#0d948860',
        background: 'linear-gradient(to bottom, #0d1b1b, #1a2f2f)',
        animation: 'pulse 2s infinite'
      },
      choice: {
        glow: '0 0 20px #fcd34d40',
        border: '#fcd34d60',
        background: 'linear-gradient(to bottom, #0d1b1b, #1a2f2f)',
        animation: 'none'
      }
    }
  }
};

// Card type color constants
export const cardTypeColors = {
  lightTrap: {
    base: '#ffffff',
    glow: '0 0 25px #ffffff'
  },
  darkRoom: {
    base: '#4b5563',
    glow: '0 0 15px #4b5563'
  },
  special: {
    base: '#60a5fa',
    glow: '0 0 35px rgba(96, 165, 250, 0.7)'
  },
  choice: {
    base: '#fcd34d',
    glow: '0 0 25px #fcd34d60'
  }
};

// Animation keyframes
export const keyframes = `
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }
`;

export default themes;