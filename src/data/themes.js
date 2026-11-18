// Each sector re-skins the Spire. Card backs reuse the original art.
const themes = {
  frozen: {
    id: 'frozen',
    name: 'Cryo Vault',
    tagline: 'Frozen data halls under permafrost',
    accent: '#5ee7ff',
    accentSoft: 'rgba(94, 231, 255, 0.18)',
    secondary: '#7c8cff',
    bg: 'radial-gradient(ellipse at 50% 120%, #0b2a44 0%, #050914 55%, #02030a 100%)',
    cardBack: '/images/frosty.png',
    particle: { color: '94, 231, 255', drift: -0.15, rise: 0.35, size: [0.6, 2.2] },
    ambient: { root: 55, filter: 900, wobble: 0.07 },
  },
  fire: {
    id: 'fire',
    name: 'Reactor Core',
    tagline: 'Molten conduits, ash in the air',
    accent: '#ff7a3c',
    accentSoft: 'rgba(255, 122, 60, 0.18)',
    secondary: '#ff3c6e',
    bg: 'radial-gradient(ellipse at 50% 120%, #3a1006 0%, #0e0507 55%, #050203 100%)',
    cardBack: '/images/fire.png',
    particle: { color: '255, 140, 70', drift: 0.1, rise: -0.6, size: [0.8, 2.6] },
    ambient: { root: 41, filter: 650, wobble: 0.12 },
  },
  garden: {
    id: 'garden',
    name: 'Bio Dome',
    tagline: 'Overgrown labs, glowing spores',
    accent: '#3dffb4',
    accentSoft: 'rgba(61, 255, 180, 0.16)',
    secondary: '#b46bff',
    bg: 'radial-gradient(ellipse at 50% 120%, #06352a 0%, #040e10 55%, #020506 100%)',
    cardBack: '/images/garden.png',
    particle: { color: '120, 255, 200', drift: 0.05, rise: -0.2, size: [1, 3] },
    ambient: { root: 49, filter: 1100, wobble: 0.05 },
  },
};

export const KIND_STYLE = {
  safe: { label: 'SAFE', color: '#8aa0b8', icon: '◼' },
  trap: { label: 'LIGHT TRAP', color: '#fff4c2', icon: '✦' },
  choice: { label: 'SIGNAL', color: '#c18bff', icon: '◈' },
  supply: { label: 'CACHE', color: '#ffc857', icon: '▣' },
  unknown: { label: 'UNKNOWN', color: '#6b7a90', icon: '?' },
};

export default themes;
