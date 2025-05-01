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
    
    try {
      audioManager.resetPlayCounts();
      audioManager.play('damage');

      setHealth(currentHealth => {
        const newHealth = Math.max(0, currentHealth - amount);
        if (newHealth === 0 && !gameOver) {
          setGameOver(true);
          setGameResult('defeat');
          audioManager.resetPlayCounts();
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

      addMessage(amount === 1 ? 'You take 1 damage!' : `You take ${amount} damage!`);
      return Promise.resolve();
    } catch (error) {
      console.error('Error in takeDamage:', error);
      return Promise.reject(error);
    }
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
      try {
        // Reset audio manager play counts before victory
        audioManager.resetPlayCounts();
        setGameOver(true);
        setGameResult('victory');
        audioManager.play('victory');
        addMessage('Victory! You mastered the shadows!');
        
        // Store victory state to unlock endless mode
        localStorage.setItem('hasWonStandardMode', 'true');
        return true;
      } catch (error) {
        console.error('Error checking victory:', error);
        addMessage('Error processing victory state');
      }
    }
    return false;
  }, [isEndless, turns, gameOver, setGameOver, setGameResult, addMessage, setEndlessStats]);

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