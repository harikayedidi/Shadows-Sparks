import { useState, useCallback } from 'react';
import { cardData } from '../data/cards';

export const useDynamicDeck = () => {
  const [deckStats, setDeckStats] = useState({
    turnsWithoutDamage: 0,
    lastDrawnType: null
  });

  const createDeck = useCallback((difficulty = 2) => {
    // Base probabilities
    let darkRoomCount = 15;
    let lightTrapCount = 8;
    let specialEventCount = 5;
    let itemCount = 5;
    
    // Adjust based on difficulty (0-4 scale)
    if (difficulty >= 3) { // Player doing well
      darkRoomCount -= 2;
      lightTrapCount += 2;
      specialEventCount += 1;
    } else if (difficulty <= 1) { // Player struggling
      darkRoomCount += 2;
      lightTrapCount -= 1;
      itemCount += 1;
    }
    
    // Create deck with adjusted probabilities
    const deck = [
      ...cardData.darkRooms.slice(0, darkRoomCount),
      ...cardData.lightTraps.slice(0, lightTrapCount),
      ...cardData.specialEvents.slice(0, specialEventCount),
      ...cardData.items.slice(0, itemCount)
    ];
    
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  }, []);

  const calculateDifficulty = useCallback((health, inventory, turnsWithoutDamage) => {
    let score = 0;
    
    // Health status affects difficulty
    score += (health / 5) * 2; // 0-2 points based on health
    
    // Full inventory indicates good performance
    if (inventory.every(item => item !== null)) {
      score += 1;
    }
    
    // Long streaks without damage increase difficulty
    score += Math.min(turnsWithoutDamage / 3, 1); // Up to 1 point for no-damage streaks
    
    return score; // 0-4 scale: 0-1 struggling, 2-3 balanced, 3-4 excelling
  }, []);

  const updateDeckStats = useCallback((cardType) => {
    setDeckStats(prev => ({
      turnsWithoutDamage: cardType !== 'light' ? prev.turnsWithoutDamage + 1 : 0,
      lastDrawnType: cardType
    }));
  }, []);

  return {
    createDeck,
    calculateDifficulty,
    updateDeckStats,
    deckStats
  };
};