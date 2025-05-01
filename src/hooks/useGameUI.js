import { useState, useEffect, useCallback } from 'react';
import themes from '../data/themes';

export const useGameUI = () => {
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('hasSeenWelcome');
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    return themes[savedTheme] || themes.frozen;
  });
  
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showInstructions, setShowInstructions] = useState(true);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowInstructions(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle welcome popup
  const closeWelcome = useCallback(() => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  }, []);

  // Show inventory when first item is obtained
  const revealInventory = useCallback(() => {
    setShowInventory(true);
  }, []);

  // Toggle instructions visibility
  const toggleInstructions = useCallback(() => {
    setShowInstructions(prev => !prev);
  }, []);

  const toggleThemeSelector = useCallback(() => {
    setShowThemeSelector(prev => !prev);
  }, []);

  // Handle theme changes
  const handleThemeChange = useCallback((newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('selectedTheme', newTheme.name.toLowerCase());
  }, []);

  return {
    // UI State
    showWelcome,
    showInventory,
    isMobile,
    showInstructions,
    showThemeSelector,
    theme,

    // Actions
    closeWelcome,
    revealInventory,
    toggleInstructions,
    toggleThemeSelector,
    setTheme: handleThemeChange
  };
};