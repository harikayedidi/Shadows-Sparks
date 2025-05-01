import { useCallback } from 'react';
import audioManager from '../utils/audio';

export const useGameEffects = (gameState) => {
  const {
    health,
    setHealth,
    turns,
    gameOver,
    isEndless,
    setGameOver,
    setGameResult,
    setEndlessStats,
    addMessage
  } = gameState;

  const takeDamage = useCallback(async (amount) => {
    if (!amount || amount <= 0) return Promise.resolve();

    return new Promise((resolve) => {
      // Play damage sound immediately
      audioManager.play('damage');

      // Update health
      setHealth(currentHealth => {
        const newHealth = Math.max(0, currentHealth - amount);
        
        // Check for game over
        if (newHealth === 0 && !gameOver) {
          setGameOver(true);
          setGameResult('defeat');
          audioManager.play('defeat');
          
          if (isEndless) {
            setEndlessStats(prev => ({
              ...prev,
              totalTurns: prev.totalTurns + turns,
              highScore: Math.max(prev.highScore, turns),
              lastScore: turns
            }));
            addMessage(`Game Over! You survived ${turns} turns in endless mode!`);
          } else {
            addMessage('Game Over! The darkness claims another victim...');
          }
        }

        return newHealth;
      });

      // Add damage message
      if (amount === 1) {
        addMessage('You take 1 damage!');
      } else {
        addMessage(`You take ${amount} damage!`);
      }

      resolve();
    });
  }, [
    gameOver,
    isEndless,
    turns,
    setHealth,
    setGameOver,
    setGameResult,
    setEndlessStats,
    addMessage
  ]);

  const checkVictory = useCallback(() => {
    if (!isEndless && turns >= 10 && !gameOver) {
      setGameOver(true);
      setGameResult('victory');
      audioManager.play('victory');
      addMessage('Victory! You mastered the shadows!');
      return true;
    }
    return false;
  }, [isEndless, turns, gameOver, setGameOver, setGameResult, addMessage]);

  const healHealth = useCallback((amount) => {
    if (!amount || amount <= 0) return;

    setHealth(current => {
      const newHealth = Math.min(5, current + amount);
      addMessage(`Healed ${amount} HP!`);
      return newHealth;
    });
  }, [setHealth, addMessage]);

  return {
    takeDamage,
    checkVictory,
    healHealth
  };
};