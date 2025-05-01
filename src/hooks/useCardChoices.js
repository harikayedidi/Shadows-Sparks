import { useState, useCallback } from 'react';

export const useCardChoices = (gameState, { inventory }) => {
  const { addMessage, setHealth } = gameState;
  const { handleItemDiscard, inventory: inventoryItems } = inventory;

  const [choicePopup, setChoicePopup] = useState({
    isOpen: false,
    description: '',
    choices: [],
    onChoice: null
  });

  const handleChoice = useCallback((choice, onComplete) => {
    switch (choice.action) {
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
    closeChoice
  };
};