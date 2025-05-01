import { useState, useCallback } from 'react';
import { specialItems } from '../data/cards';

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
          // Success: Add random special item (equal chance for each type)
          const randomIndex = Math.floor(Math.random() * specialItems.length);
          const item = specialItems[randomIndex];
          addToInventory(item);
          addMessage(`The magic works in your favor! You receive a ${item.title}.`);
        } else {
          // Fail: Subtract 1 HP
          setHealth(h => Math.max(0, h - 1));
          addMessage('The magic backfires! You take 1 damage.');
        }
        break;

      case 'damage_reward':
        // Subtract 1 HP first
        setHealth(h => Math.max(0, h - 1));
        // Then add random special item
        const item = specialItems[Math.floor(Math.random() * specialItems.length)];
        addToInventory(item);
        addMessage(`You sacrificed 1 HP and received a ${item.title}.`);
        break;

      case 'heal_then_corrupt':
        // Heal specified amount
        if (choice.heal) {
          setHealth(h => Math.min(5, h + choice.heal));
          addMessage(`You heal ${choice.heal} HP.`);
        }
        // Set corrupt for next draw
        setCorruptedDraws(1);
        addMessage('But dark energy corrupts your next draw...');
        break;

      case 'heal':
        if (choice.heal) {
          setHealth(h => Math.min(5, h + choice.heal));
          addMessage(`You heal ${choice.heal} HP.`);
        }
        break;

      case 'reward':
        if (choice.reward === 'item') {
          // Equal chance for any special item
          const item = specialItems[Math.floor(Math.random() * specialItems.length)];
          addToInventory(item);
          addMessage(`You received a ${item.title}!`);
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
  }, [setHealth, addMessage, addToInventory]);

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