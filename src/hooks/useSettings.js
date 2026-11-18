import { createContext, useContext } from 'react';

// motion: 'full' | 'reduced' | 'off'. glow: boolean.
export const SettingsContext = createContext({ motion: 'full', glow: true });

export function useSettings() {
  const settings = useContext(SettingsContext);
  return { ...settings, full: settings.motion === 'full', off: settings.motion === 'off' };
}
