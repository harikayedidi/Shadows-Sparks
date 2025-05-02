import { useState, useCallback } from 'react';
import { cardData } from '../data/cards';
import audioManager from '../utils/audio';

const STANDARD_DECK_SIZE = 10;

export const useCardManagement = (gameState, { inventory, takeDamage, cardChoices }) => {
  const { isEndless, addMessage, setGameOver, setGameResult, incrementTurn } = gameState;
  const { skipNextTurn, setSkipNextTurn, blockNextLightTrap, setBlockNextLightTrap } = inventory;

  const createDeckWithDifficulty = useCallback((isEndless = false) => {
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    
    if (isEndless) {
      // In endless mode, generate a smaller dynamic deck that gets replenished
      const generateEndlessDeck = () => {
        const darkRoomChance = 0.3;   // 30% chance for safe room
        const deckSize = 5;           // Smaller deck that gets replenished
        const deck = [];
        
        for (let i = 0; i < deckSize; i++) {
          const roll = Math.random();
          let card;
          
          if (roll < darkRoomChance) {
            // Add safe room
            card = cardData.darkRooms[Math.floor(Math.random() * cardData.darkRooms.length)];
          } else {
            // Add trap or choice card
            const poolSize = cardData.lightTraps.length + cardData.dangerousTraps.length + cardData.choiceCards.length;
            const poolIndex = Math.floor(Math.random() * poolSize);
            if (poolIndex < cardData.lightTraps.length) {
              card = cardData.lightTraps[poolIndex];
            } else if (poolIndex < cardData.lightTraps.length + cardData.dangerousTraps.length) {
              card = cardData.dangerousTraps[poolIndex - cardData.lightTraps.length];
            } else {
              card = cardData.choiceCards[poolIndex - (cardData.lightTraps.length + cardData.dangerousTraps.length)];
            }
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
    const safeRooms = shuffle(cardData.darkRooms).slice(0, Math.floor(Math.random() * 3) + 1);
    const lightTraps = shuffle(cardData.lightTraps).slice(0, Math.floor(Math.random() * 2) + 1);
    const dangerTraps = shuffle(cardData.dangerousTraps).slice(0, Math.floor(Math.random() * 2) + 1);
    const choiceCards = [cardData.choiceCards[Math.floor(Math.random() * cardData.choiceCards.length)]];
    
    let deck = [
      ...safeRooms,
      ...lightTraps,
      ...dangerTraps,
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
  const [remainingDraws, setRemainingDraws] = useState(isEndless ? Infinity : STANDARD_DECK_SIZE);

  const handleDamage = useCallback(async (card) => {
    if (!card) return;

    // Handle light trap damage with shield check
    if (card.type === 'lightTrap' && blockNextLightTrap) {
      setBlockNextLightTrap(false);
      addMessage('Light Shield absorbed the damage! No HP lost.');
      audioManager.play('itemUse');
      return;
    }

    // Play damage sound immediately
    audioManager.play('damage');
    
    if (card.damage) {
      await takeDamage(card.damage);
      addMessage(`${card.title} deals ${card.damage} damage!`);
    }
  }, [takeDamage, addMessage, blockNextLightTrap, setBlockNextLightTrap]);

  const handleCardEffect = useCallback(async (card) => {
    if (!card) return;
    
    try {
      // Handle damage from traps
      if (card.type === 'lightTrap' || card.type === 'trap') {
        await handleDamage(card);
      }
      
      // Handle other effects after damage
      if (card?.effect) {
        switch (card.effect) {
          case 'corrupt_next_1':
            cardChoices.current?.setCorruptedDraws(1);
            addMessage('Corrupted! Your next draw will be dangerous...');
            // Play corruption sound
            audioManager.play('damage');
            // Add corrupted deck visual effect
            document.querySelector('.game-content').classList.add('corrupted-deck');
            // Remove the effect after corruption ends
            setTimeout(() => {
              document.querySelector('.game-content').classList.remove('corrupted-deck');
            }, 2000);
            break;
            
          case 'lose_hp_draw_2':
            // Add chain reaction effect
            const gameContent = document.querySelector('.game-content');
            gameContent.classList.add('chain-reaction');
            
            await handleDamage(card);
            addMessage('Chain Reaction! You lost 1 HP and were forced to draw 2 more cards!');
            
            // Remove animation class after it completes
            setTimeout(() => {
              gameContent.classList.remove('chain-reaction');
            }, 500);
            
            // Play chain reaction sound
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
  }, [handleDamage, addMessage]);

  const drawCard = useCallback(async () => {
    try {
      // Prevent drawing if game is in transition
      if (gameState.gameOver) return;
      if (cardChoices?.current?.choicePopup?.isOpen) return;

      // Handle skip turn state
      if (skipNextTurn) {
        setSkipNextTurn(false);
        addMessage('Turn skipped (hiding in shadows).');
        incrementTurn();
        return;
      }

      // Check if we need to replenish deck or handle game end
      if (deck.length === 0) {
        if (isEndless) {
          const newDeck = createDeckWithDifficulty(true);
          setDeck(newDeck);
          addMessage('The shadows shift... a new set of rooms appears.');
          // Draw from the new deck after a short delay to ensure state update
          await new Promise(resolve => setTimeout(resolve, 100));
          const drawnCard = newDeck[newDeck.length - 1];
          setDeck(newDeck.slice(0, -1));
          setCurrentCard(drawnCard);
          setIsFlipped(true);
          audioManager.play('cardFlip');
          
          if (drawnCard?.hasChoice && cardChoices?.current) {
            cardChoices.current.showChoice(
              drawnCard.title,
              drawnCard.choices,
              () => handleCardEffect(drawnCard)
            );
          } else if (drawnCard) {
            await handleCardEffect(drawnCard);
          }
          return;
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
      incrementTurn();
      
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
      setRemainingDraws(isEndless ? Infinity : STANDARD_DECK_SIZE);
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