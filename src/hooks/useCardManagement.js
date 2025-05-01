import { useState, useCallback, useEffect } from 'react';
import { cardData } from '../data/cards';
import audioManager from '../utils/audio';

const STANDARD_DECK_SIZE = 10;

export const useCardManagement = (gameState, { inventory, takeDamage, cardChoices }) => {
  const { isEndless, turns, addMessage, setGameOver, setGameResult, incrementTurn } = gameState;
  const { skipNextTurn, setSkipNextTurn, addToInventory, revealInventory } = inventory;

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

  // Initialize state after createDeckWithDifficulty is defined
  const [deck, setDeck] = useState(() => createDeckWithDifficulty(isEndless));
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [remainingDraws, setRemainingDraws] = useState(STANDARD_DECK_SIZE);

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
    
    try {
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
          cardChoices.current?.setCorruptedDraws(2);
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
            
            // Draw two cards with proper async handling
            try {
              await new Promise(resolve => setTimeout(resolve, 800));
              await drawCard();
              await new Promise(resolve => setTimeout(resolve, 800));
              await drawCard();
            } catch (error) {
              console.error('Error in chain reaction draw:', error);
              addMessage('Chain reaction was interrupted');
            }
          }
          break;
          
        default:
          if (card.type === 'darkRoom') {
            addMessage('You pass safely through the darkness.');
          }
      }
    }
    } catch (error) {
      console.error('Error handling card effect:', error);
      addMessage('An error occurred while handling the card effect.');
    }
  }, [handleDamage, addMessage, revealInventory, addToInventory, setSkipNextTurn]);

  const drawCard = useCallback(async () => {
    try {
      // Prevent drawing if game is in transition
      if (gameState.gameOver) return;
      if (cardChoices?.current?.choicePopup?.isOpen) return;

      // Handle skip turn state
      if (skipNextTurn) {
        setSkipNextTurn(false);
        addMessage('Turn skipped (hiding in shadows).');
        return;
      }

      // Check if we need to replenish deck or handle game end
      if (deck.length === 0) {
        if (isEndless) {
          const newDeck = createDeckWithDifficulty(true);
          await new Promise(resolve => {
            setDeck(newDeck);
            addMessage('The shadows shift... a new set of rooms appears.');
            resolve();
          });
          // Continue with the draw after deck is replenished
          return drawCard();
        } else {
          setGameOver(true);
          setGameResult('victory');
          addMessage('You have survived the shadows!');
          return;
        }
      }

      if (deck.length === 1 && !isEndless) {
        setGameOver(true);
        setGameResult('victory');
        addMessage('You have survived the shadows!');
        return;
      }

      // Increment turn counter before any card effects
      if (!skipNextTurn) {
        incrementTurn();
      }
      
      // Update remaining draws count for standard mode
      if (!isEndless) {
        setRemainingDraws(prev => Math.max(0, prev - 1));
      }

      // Draw a card
      const newDeck = [...deck];
      let drawnCard;

      if (cardChoices.current?.corruptedDraws > 0) {
        const trapCard = cardData.dangerousTraps[
          Math.floor(Math.random() * cardData.dangerousTraps.length)
        ];
        drawnCard = { ...trapCard, id: Math.random() };
        cardChoices.current.setCorruptedDraws(prev => prev - 1);
        addMessage('The corruption manifests!');
      } else {
        drawnCard = newDeck.pop();
      }

      setDeck(newDeck);
      audioManager.play('cardFlip');

      // Card reveal sequence with error handling
      try {
        setIsFlipped(false);
        setCurrentCard(null);

        // Wait for state updates
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setCurrentCard(drawnCard);
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsFlipped(true);
      } catch (error) {
        console.error('Error in card reveal sequence:', error);
        // Reset state on error
        setIsFlipped(false);
        setCurrentCard(null);
        throw new Error('Card reveal failed');
      }

      // Handle card effects
      if (drawnCard?.type === 'special' && drawnCard.title.toLowerCase().includes('skip')) {
        setSkipNextTurn(true);
        addMessage('You found a Skip card! Next turn will be skipped.');
        return;
      }

      if (drawnCard?.hasChoice && cardChoices?.current) {
        cardChoices.current.showChoice(
          drawnCard.title,
          drawnCard.choices,
          () => handleCardEffect(drawnCard)
        );
      } else if (drawnCard) {
        await handleCardEffect(drawnCard);
      }
    } catch (error) {
      console.error('Error drawing card:', error);
      addMessage('An error occurred while drawing a card.');
    }
  }, [
    deck,
    skipNextTurn,
    cardChoices,
    handleCardEffect,
    addMessage,
    setSkipNextTurn,
    isEndless,
    setGameOver,
    setGameResult,
    createDeckWithDifficulty,
    incrementTurn,
    setRemainingDraws
  ]);

  const resetCardState = useCallback(async () => {
    try {
      const initialDeck = createDeckWithDifficulty(isEndless);
      setDeck(initialDeck);
      setCurrentCard(null);
      setIsFlipped(false);
      if (cardChoices.current) {
        cardChoices.current.setCorruptedDraws(0);
      }
      setRemainingDraws(STANDARD_DECK_SIZE);
      addMessage('Deck shuffled and ready.');
      return Promise.resolve();
    } catch (error) {
      console.error('Error resetting card state:', error);
      return Promise.reject(error);
    }
  }, [createDeckWithDifficulty, addMessage, isEndless, setRemainingDraws]);

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