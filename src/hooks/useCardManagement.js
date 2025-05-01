import { useState, useCallback } from 'react';
import { cardData } from '../data/cards';
import audioManager from '../utils/audio';

const STANDARD_DECK_SIZE = 10;

export const useCardManagement = (gameState, { inventory, takeDamage, cardChoices }) => {
  const { isEndless, turns, addMessage, setGameOver, setGameResult } = gameState;
  const { skipNextTurn, setSkipNextTurn, addToInventory, revealInventory } = inventory;

  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [corruptedDraws, setCorruptedDraws] = useState(0);
  const [remainingDraws, setRemainingDraws] = useState(isEndless ? 0 : STANDARD_DECK_SIZE);

  const createDeckWithDifficulty = useCallback((isEndless = false) => {
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    
    if (isEndless) {
      // In endless mode, generate a smaller dynamic deck that gets replenished
      const generateEndlessDeck = () => {
        const specialCardChance = 0.2; // 20% chance for special card
        const darkRoomChance = 0.3;   // 30% chance for safe room
        const deckSize = 5;           // Smaller deck that gets replenished

        const deck = [];
        
        for (let i = 0; i < deckSize; i++) {
          const roll = Math.random();
          let card;
          
          if (roll < specialCardChance) {
            // Add special card
            card = cardData.specialCards[Math.floor(Math.random() * cardData.specialCards.length)];
          } else if (roll < specialCardChance + darkRoomChance) {
            // Add safe room
            card = cardData.darkRooms[Math.floor(Math.random() * cardData.darkRooms.length)];
          } else {
            // Add trap
            const trapPool = [...cardData.lightTraps, ...cardData.dangerousTraps];
            card = trapPool[Math.floor(Math.random() * trapPool.length)];
          }
          
          deck.push({
            ...card,
            id: Math.random()
          });
        }
        
        return shuffle(deck);
      };
      
      return generateEndlessDeck();
    }
    
    // Standard mode: Random within max limits
    // Max 3 safe rooms (30%)
    // Max 4 traps (40%)
    // Max 3 special/choice (30%)
    
    const safeRooms = shuffle(cardData.darkRooms).slice(0, Math.floor(Math.random() * 3) + 1);
    const lightTraps = shuffle(cardData.lightTraps).slice(0, Math.floor(Math.random() * 2) + 1);
    const dangerTraps = shuffle(cardData.dangerousTraps).slice(0, Math.floor(Math.random() * 2) + 1);
    const specialCards = shuffle(cardData.specialCards).slice(0, Math.floor(Math.random() * 2) + 1);
    const choiceCards = [cardData.choiceCards[Math.floor(Math.random() * cardData.choiceCards.length)]];
    
    let deck = [
      ...safeRooms,
      ...lightTraps,
      ...dangerTraps,
      ...specialCards,
      ...choiceCards
    ];
    
    // If we don't have enough cards, add random safe rooms until we reach STANDARD_DECK_SIZE
    while (deck.length < STANDARD_DECK_SIZE) {
      deck.push(cardData.darkRooms[Math.floor(Math.random() * cardData.darkRooms.length)]);
    }
    
    // If we have too many cards, trim to STANDARD_DECK_SIZE
    deck = deck.slice(0, STANDARD_DECK_SIZE);
    
    // Map and shuffle the final deck
    return shuffle(deck.map(card => ({
      ...card,
      id: Math.random()
    })));
  }, []);

  const handleDamage = useCallback(async (card) => {
    if (!card) return;

    // Play damage sound immediately
    audioManager.play('damage');
    
    if (card.damage) {
      await takeDamage(card.damage);
      addMessage(`${card.title} deals ${card.damage} damage!`);
    }
  }, [takeDamage, addMessage]);

  const handleCardEffect = useCallback(async (card) => {
    if (!card) return;

    // Handle different card types
    if (card.type === 'special') {
      // Special cards should not trigger damage effects
      audioManager.play('itemUse');
      revealInventory();
      addToInventory(card);
      addMessage(`Found a ${card.title}!`);
      audioManager.play('itemUse');
    }
    
    // Handle damage from light traps
    if (card.type === 'lightTrap' || card.type === 'trap') {
      await handleDamage(card);
    }
    
    // Handle other effects after damage
    if (card?.effect) {
      switch (card.effect) {
        case 'corrupt_next_2':
          setCorruptedDraws(2);
          addMessage('Corrupted! Your next 2 draws will be dangerous...');
          // Play corruption sound
          audioManager.play('damage');
          // Add corrupted deck visual effect by adding a class to the deck
          document.querySelector('.game-content').classList.add('corrupted-deck');
          // Remove the effect after corruption ends
          setTimeout(() => {
            document.querySelector('.game-content').classList.remove('corrupted-deck');
          }, 2000);
          break;
          
        case 'lose_hp_draw_2':
          if (card.type !== 'special') { // Don't apply damage if it's a special card
            // Add chain reaction effect once
            const gameContent = document.querySelector('.game-content');
            gameContent.classList.add('chain-reaction');
            
            await handleDamage(card);
            addMessage('Chain Reaction! You lost 1 HP and were forced to draw 2 more cards!');
            
            // Remove animation class after it completes
            setTimeout(() => {
              gameContent.classList.remove('chain-reaction');
            }, 500);
            
            // Play chain reaction sound only once
            audioManager.play('damage');
            
            // Draw two cards with a slight delay between
            setTimeout(async () => {
              await drawCard();
              setTimeout(drawCard, 800);
            }, 800);
          }
          break;
          
        default:
          if (card.type === 'darkRoom') {
            addMessage('You pass safely through the darkness.');
          }
      }
    }
  }, [handleDamage, addMessage, revealInventory, addToInventory]);

  const drawCard = useCallback(async () => {
    if (skipNextTurn) {
      setSkipNextTurn(false);
      addMessage('Turn skipped (hiding in shadows).');
      return;
    }

    // In endless mode, replenish deck when empty
    if (deck.length === 0 && isEndless) {
      const newDeck = createDeckWithDifficulty(true);
      setDeck(newDeck);
      addMessage('The shadows shift... a new set of rooms appears.');
    }

    // Check for standard mode victory
    if (deck.length === 1 && !isEndless) {
      // ... [victory logic remains the same]
      return;
    }

    // Don't track remaining draws in endless mode
    if (!isEndless) {
      setRemainingDraws(prev => prev - 1);
    }

    // Draw a card
    const newDeck = [...deck];
    let drawnCard;

    if (corruptedDraws > 0) {
      const trapCard = cardData.dangerousTraps[
        Math.floor(Math.random() * cardData.dangerousTraps.length)
      ];
      drawnCard = { ...trapCard, id: Math.random() };
      setCorruptedDraws(prev => prev - 1);
      addMessage('The corruption manifests!');
    } else {
      drawnCard = newDeck.pop();
    }

    setDeck(newDeck);
    audioManager.play('cardFlip');

    setIsFlipped(false);
    setCurrentCard(null);

    // Reveal the card and handle its effects
    setTimeout(async () => {
      setCurrentCard(drawnCard);
      setIsFlipped(true);

      if (drawnCard?.hasChoice && cardChoices) {
        cardChoices.showChoice(
          drawnCard.title,
          drawnCard.choices,
          () => handleCardEffect(drawnCard)
        );
      } else if (drawnCard) {
        await handleCardEffect(drawnCard);
      }
    }, 100);
  }, [
    deck,
    skipNextTurn,
    corruptedDraws,
    cardChoices,
    handleCardEffect,
    addMessage,
    setSkipNextTurn,
    isEndless,
    setGameOver,
    setGameResult
  ]);

  const resetCardState = useCallback(async () => {
    try {
      const initialDeck = createDeckWithDifficulty(isEndless);
      setDeck(initialDeck);
      setCurrentCard(null);
      setIsFlipped(false);
      setCorruptedDraws(0);
      setRemainingDraws(isEndless ? 0 : STANDARD_DECK_SIZE);
      addMessage(isEndless ? 'Endless deck ready.' : 'Deck shuffled and ready.');
      return Promise.resolve();
    } catch (error) {
      console.error('Error resetting card state:', error);
      return Promise.reject(error);
    }
  }, [createDeckWithDifficulty, addMessage, isEndless]);

  return {
    deck,
    currentCard,
    isFlipped,
    drawCard,
    resetCardState,
    remainingDraws,
    STANDARD_DECK_SIZE
  };
};