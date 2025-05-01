import { useState, useCallback, useEffect } from 'react';

export const useGameState = () => {
  // Core game state
  const [health, setHealth] = useState(5);
  const [turns, setTurns] = useState(0);
  const [endlessTurns, setEndlessTurns] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [isEndless, setIsEndless] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  // Update endless turns when turns change in endless mode
  useEffect(() => {
    if (isEndless) {
      setEndlessTurns(turns);
    }
  }, [turns, isEndless]);

  // Endless mode state
  const [endlessModeUnlocked, setEndlessModeUnlocked] = useState(() => {
    const hasWon = localStorage.getItem('hasWonStandardMode');
    return hasWon === 'true';
  });

  const [endlessStats, setEndlessStats] = useState(() => {
    const savedStats = localStorage.getItem('endlessStats');
    return savedStats ? JSON.parse(savedStats) : {
      wins: 0,
      totalTurns: 0,
      highScore: 0,
      lastScore: 0
    };
  });

  // Save stats on change
  useEffect(() => {
    localStorage.setItem('endlessStats', JSON.stringify(endlessStats));
  }, [endlessStats]);

  // Message handling
  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Sound handling
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Game reset
  const resetGameState = useCallback(async (endless = false) => {
    try {
      setHealth(5);
      setTurns(0);
      setEndlessTurns(0);
      setGameOver(false);
      setGameResult(null);
      setIsEndless(endless);
      setMessages([
        'Welcome to Shadows & Sparks! 🌓',
        endless
          ? endlessStats.highScore > 0
            ? `Endless Mode: Try to beat your record of ${endlessStats.highScore} turns!`
            : 'Endless Mode: How long can you survive?'
          : 'Standard Mode: Survive 10 rounds to win!'
      ]);

      return Promise.resolve();
    } catch (error) {
      console.error('Error resetting game state:', error);
      return Promise.reject(error);
    }
  }, [endlessStats.highScore]);

  // Update endless mode unlock status
  useEffect(() => {
    if (gameResult === 'victory' && !isEndless) {
      setEndlessModeUnlocked(true);
      localStorage.setItem('hasWonStandardMode', 'true');
    }
  }, [gameResult, isEndless]);

  return {
    // State values
    health,
    turns: isEndless ? endlessTurns : turns,
    gameOver,
    gameResult,
    isEndless,
    messages,
    isMuted,
    endlessStats,
    endlessModeUnlocked,

    // Core setters
    setHealth,
    setTurns,
    setGameOver,
    setGameResult,
    setIsEndless,
    setEndlessStats,
    setEndlessModeUnlocked,

    // Actions
    addMessage,
    toggleMute,
    resetGameState
  };
};