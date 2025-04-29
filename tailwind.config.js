/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'card-flip': 'flip 0.6s ease-in-out',
        'gradient': 'gradient 3s ease infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(34,197,94,0.3)',
        'glow-red': '0 0 15px rgba(239,68,68,0.3)',
        'glow-yellow': '0 0 15px rgba(234,179,8,0.3)',
        'glow-rainbow': '0 0 20px rgba(167,139,250,0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    'border-red-500',
    'border-green-500',
    'border-yellow-400',
    'border-gray-600',
    'shadow-glow-green',
    'shadow-glow-red',
    'shadow-glow-yellow',
    'shadow-glow-rainbow',
  ]
}