import { useState, useCallback } from 'react';
import audioManager from '../utils/audio';

const MAX_INVENTORY_SLOTS = 2;

export const useInventory = (gameState) => {
  const { addMessage, setHealth, health } = gameState;
  
  const [inventory, setInventory] = useState(Array(MAX_INVENTORY_SLOTS).fill(null));
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [skipNextTurn, setSkipNextTurn] = useState(false);
  const [blockNextLightTrap, setBlockNextLightTrap] = useState(false);

  const revealInventory = useCallback(() => {
    if (!inventoryVisible) {
      setInventoryVisible(true);
      addMessage('Inventory panel unlocked!');
    }
  }, [inventoryVisible, addMessage]);

  const addToInventory = useCallback((item) => {
    if (!item) return false;

    const emptySlot = inventory.findIndex(slot => slot === null);
    if (emptySlot === -1) {
      addMessage('Inventory is full!');
      return false;
    }

    const newInventory = [...inventory];
    newInventory[emptySlot] = item;
    setInventory(newInventory);
    
    // Ensure inventory is visible when getting first item
    if (!inventoryVisible) {
      revealInventory();
    }

    addMessage(`Added ${item.title} to inventory slot ${emptySlot + 1}`);
    audioManager.play('itemUse');
    return true;
  }, [inventory, inventoryVisible, addMessage, revealInventory]);

  const useItem = useCallback((item, slot) => {
    if (!item || slot < 0 || slot >= MAX_INVENTORY_SLOTS) return;

    // Clear the slot first
    const newInventory = [...inventory];
    newInventory[slot] = null;
    setInventory(newInventory);
    audioManager.play('itemUse');

    // Handle item effects
    switch (item.use) {
      case 'heal_and_skip':
        setHealth(prev => Math.min(prev + 1, 5)); // Heal 1 HP, capped at max
        setSkipNextTurn(true);
        addMessage('Shadow Cloak used: Healed 1 HP and will skip next turn.');
        break;
      case 'activate_shield':
        setBlockNextLightTrap(true);
        addMessage('Light Shield activated! You\'ll block the next light trap.');
        break;
      default:
        addMessage(`Used ${item.title}!`);
    }
  }, [inventory, addMessage, setHealth, setSkipNextTurn]);

  const handleItemDiscard = useCallback(() => {
    // Find first non-empty slot
    const itemSlot = inventory.findIndex(item => item !== null);
    if (itemSlot === -1) {
      addMessage('No items to discard!');
      return false;
    }

    const newInventory = [...inventory];
    const discardedItem = newInventory[itemSlot];
    newInventory[itemSlot] = null;
    setInventory(newInventory);

    addMessage(`Discarded ${discardedItem.title}!`);
    audioManager.play('itemUse');
    return true;
  }, [inventory, addMessage]);

  const resetInventory = useCallback(async () => {
    try {
      setInventory(Array(MAX_INVENTORY_SLOTS).fill(null));
      setInventoryVisible(false);
      setSkipNextTurn(false);
      setBlockNextLightTrap(false);
      return Promise.resolve();
    } catch (error) {
      console.error('Error resetting inventory:', error);
      return Promise.reject(error);
    }
  }, []);

  return {
    inventory,
    showInventory: inventoryVisible,
    skipNextTurn,
    blockNextLightTrap,
    addToInventory,
    useItem,
    handleItemDiscard,
    resetInventory,
    revealInventory,
    setSkipNextTurn,
    setBlockNextLightTrap,
    MAX_INVENTORY_SLOTS
  };
};