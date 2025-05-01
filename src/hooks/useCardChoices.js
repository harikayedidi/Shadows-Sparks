import { useState, useCallback } from 'react';
import { cardData } from '../data/cards';

export const useCardChoices = (gameState, { inventory }) => {
  const { addMessage, setHealth } = gameState;
  const { handleItemDiscard, inventory: inventoryItems, addToInventory } = inventory;
  const [corruptedDraws, setCorruptedDraws] = useState(0);
  const [choicePopup, setChoicePopup] = useState({
    isOpen: false,
    description: '',
    choices: [],
    onChoice: null
  });

  const handleChoice = useCallback((choice, onComplete) => {
    switch (choice.action) {
      case 'random_reward_or_damage':
        if (Math.random() < 0.5) {
          // Success: Add random special card
          const specialCards = cardData.specialCards;
          const randomCard = specialCards[Math.floor(Math.random() * specialCards.length)];
          addToInventory(randomCard);
          addMessage('The magic works in your favor! You receive a special item.');
        } else {
          // Fail: Subtract 1 HP
          setHealth(h => Math.max(0, h - 1));
          addMessage('The magic backfires! You take 1 damage.');
        }
        break;

      case 'damage_reward':
        // Subtract 1 HP
        setHealth(h => Math.max(0, h - 1));
        // Add random special card
        const specialCard = cardData.specialCards[Math.floor(Math.random() * cardData.specialCards.length)];
        addToInventory(specialCard);
        addMessage('You sacrificed 1 HP and received a powerful item.');
        break;

      case 'heal_then_corrupt':
        // Heal 1 HP
        setHealth(h => Math.min(5, h + 1));
        // Set corrupt for next draw
        setCorruptedDraws(1);
        addMessage('You feel renewed... but something dark awaits your next draw.');
        break;

      case 'damage':
        setHealth(h => Math.max(0, h - 1));
        addMessage('You take 1 damage from your choice.');
        if (choice.reward === 'item') {
          addMessage('But you find something useful!');
        }
        break;

      case 'heal':
        setHealth(h => Math.min(5, h + 1));
        addMessage('You recover 1 HP.');
        break;

      case 'draw':
        addMessage('You draw another card.');
        break;

      case 'discard_item':
        const discarded = handleItemDiscard();
        if (!discarded) {
          setHealth(h => Math.max(0, h - 2));
          addMessage('With no item to discard, you take 2 damage!');
        }
        break;

      case 'nothing':
        addMessage('You choose to play it safe.');
        break;

      default:
        addMessage(`You chose: ${choice.text}`);
    }

    // Close popup and run completion callback
    setChoicePopup(prev => ({ ...prev, isOpen: false }));
    if (onComplete) {
      setTimeout(onComplete, 500);
    }
  }, [setHealth, addMessage, handleItemDiscard]);

  const showChoice = useCallback((description, choices, onComplete) => {
    // Check inventory for choices that require items
    const hasItems = inventoryItems.some(item => item !== null);
    
    // Prepare choices with disabled state
    const preparedChoices = choices.map(choice => ({
      ...choice,
      disabled: choice.requiresInventory && !hasItems,
      disabledReason: choice.requiresInventory && !hasItems ? 'No items available to discard' : null
    }));

    setChoicePopup({
      isOpen: true,
      description,
      choices: preparedChoices,
      onChoice: (choice) => handleChoice(choice, onComplete)
    });
  }, [handleChoice, inventoryItems]);

  const closeChoice = useCallback(() => {
    setChoicePopup(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    choicePopup,
    showChoice,
    closeChoice,
    corruptedDraws,
    setCorruptedDraws
  };
};