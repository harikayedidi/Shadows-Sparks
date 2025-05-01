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

  const calculateDifficulty = useCallback((health, inventory, turnsWithoutDamage, isEndless = false, turns = 0) => {
    let score = 0;
    
    // Base difficulty calculation
    score += (health / 5) * 2; // 0-2 points based on health
    score += inventory.filter(i => i !== null).length * 0.5; // 0-1 points for inventory
    score += Math.min(turnsWithoutDamage / 3, 1); // 0-1 points for no-damage streaks
    
    // Endless mode scaling
    if (isEndless) {
      // Increase difficulty every 5 turns
      const endlessBonus = Math.floor(turns / 5) * 0.5;
      score += Math.min(endlessBonus, 2); // Cap endless bonus at 2 points
    }
    
    return Math.min(score, 4); // Keep within 0-4 scale
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