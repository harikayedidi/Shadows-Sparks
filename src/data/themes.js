// Each world re-skins the tower. Card backs reuse the original art.
const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const themes = {
  frozen: {
    id: 'frozen',
    name: 'Ice Vault',
    tagline: 'Icy and quiet',
    accent: '#5ee7ff',
    accentSoft: 'rgba(94, 231, 255, 0.18)',
    secondary: '#7c8cff',
    bg: 'radial-gradient(ellipse at 50% 120%, #0b2a44 0%, #050914 55%, #02030a 100%)',
    cardBack: asset('images/frosty.png'),
    particle: { color: '94, 231, 255', drift: -0.15, rise: 0.35, size: [0.6, 2.2] },
    ambient: { root: 55, filter: 900, wobble: 0.07 },
  },
  fire: {
    id: 'fire',
    name: 'Fire Core',
    tagline: 'Hot and smoky',
    accent: '#ff7a3c',
    accentSoft: 'rgba(255, 122, 60, 0.18)',
    secondary: '#ff3c6e',
    bg: 'radial-gradient(ellipse at 50% 120%, #3a1006 0%, #0e0507 55%, #050203 100%)',
    cardBack: asset('images/fire.png'),
    particle: { color: '255, 140, 70', drift: 0.1, rise: -0.6, size: [0.8, 2.6] },
    ambient: { root: 41, filter: 650, wobble: 0.12 },
  },
  garden: {
    id: 'garden',
    name: 'Bio Garden',
    tagline: 'Green and glowing',
    accent: '#3dffb4',
    accentSoft: 'rgba(61, 255, 180, 0.16)',
    secondary: '#b46bff',
    bg: 'radial-gradient(ellipse at 50% 120%, #06352a 0%, #040e10 55%, #020506 100%)',
    cardBack: asset('images/garden.png'),
    particle: { color: '120, 255, 200', drift: 0.05, rise: -0.2, size: [1, 3] },
    ambient: { root: 49, filter: 1100, wobble: 0.05 },
  },
};

export const KIND_STYLE = {
  safe: { label: 'DARK ROOM', color: '#8aa0b8', icon: '◼' },
  trap: { label: 'BRIGHT TRAP', color: '#fff4c2', icon: '✦' },
  choice: { label: 'EVENT', color: '#c18bff', icon: '◈' },
  supply: { label: 'LOOT', color: '#ffc857', icon: '▣' },
  boss: { label: 'BOSS', color: '#ff3c5a', icon: '✹' },
  unknown: { label: '???', color: '#6b7a90', icon: '?' },
};

export default themes;
