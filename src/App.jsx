import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './components/Card';
import HealthBar from './components/HealthBar';
import InventorySlot from './components/InventorySlot';
import GameLog from './components/GameLog';
import { createDeck } from './data/cards';

function App() {
  const [health, setHealth] = useState(5);
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [inventory, setInventory] = useState([null, null]);
  const [messages, setMessages] = useState([
    'Welcome to Shadows & Sparks! 🌓',
    'Goal: Survive 10 rounds without losing all HP',
    'Card Types:',
    '- Dark Rooms (Green): Safe passage',
    '- Light Traps (Red): DANGER! Lose 2 HP',
    '- Special Events (Yellow/Red): Various effects',
    '- Items (Yellow): Can be stored and used later',
    'Watch out for red cards - they are dangerous!'
  ]);
  const [turns, setTurns] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message].slice(-8));
  };

  const drawCard = () => {
    if (gameOver || deck.length === 0) return;

    const newDeck = [...deck];
    const drawnCard = newDeck.pop();
    setDeck(newDeck);
    setCurrentCard(drawnCard);
    setIsFlipped(true);
    setTurns(t => t + 1);

    handleCardEffect(drawnCard);
  };

  const handleCardEffect = (card) => {
    switch (card.type) {
      case 'light':
        takeDamage(2);
        break;
      case 'item':
        addToInventory(card);
        break;
      case 'event':
        handleSpecialEvent(card);
        break;
      default:
        addMessage('You pass safely through the darkness.');
    }
  };

  const takeDamage = (amount) => {
    setHealth(h => {
      const newHealth = Math.max(0, h - amount);
      if (newHealth === 0) {
        setGameOver(true);
        addMessage('Game Over! You ran out of health.');
      }
      return newHealth;
    });
    addMessage(`You took ${amount} damage!`);
  };

  const addToInventory = (item) => {
    const slot = inventory.findIndex(i => i === null);
    if (slot !== -1) {
      const newInventory = [...inventory];
      newInventory[slot] = item;
      setInventory(newInventory);
      addMessage(`Added ${item.title} to inventory!`);
    } else {
      addMessage('Inventory is full!');
    }
  };

  const handleSpecialEvent = (card) => {
    // For MVP, special events just deal 1 damage
    takeDamage(1);
    addMessage(`${card.title}: ${card.description}`);
  };

  const useItem = (item, slot) => {
    const newInventory = [...inventory];
    newInventory[slot] = null;
    setInventory(newInventory);

    switch (item.use) {
      case 'heal':
        setHealth(h => Math.min(5, h + 2));
        addMessage(`Used ${item.title} to heal 2 HP!`);
        break;
      case 'preventDamage':
        // Implementation would go here
        addMessage(`Used ${item.title}!`);
        break;
      default:
        addMessage(`Used ${item.title}!`);
    }
  };

  const checkWinCondition = () => {
    if (turns >= 10 && health > 0) {
      setGameOver(true);
      addMessage('Victory! You survived the darkness!');
    }
  };

  useEffect(() => {
    checkWinCondition();
  }, [turns]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Shadows & Sparks</h1>
          <p className="text-gray-400">Survive the darkness, avoid the light!</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Health:</span>
            <HealthBar health={health} maxHealth={5} />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-400 mb-2">Inventory:</span>
            <div className="flex gap-4">
              {inventory.map((item, index) => (
                <InventorySlot
                  key={index}
                  item={item}
                  onUseItem={useItem}
                  slotNumber={index}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard?.id || 'empty'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              <Card card={currentCard} isFlipped={isFlipped} />
            </motion.div>
          </AnimatePresence>

          <button
            className={`game-button ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={drawCard}
            disabled={gameOver}
          >
            Draw Card ({10 - turns} remaining)
          </button>

          <GameLog messages={messages} />

          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <div className="bg-gray-800 p-8 rounded-xl text-center">
                <h2 className="text-2xl font-bold mb-4">
                  {health > 0 ? 'Victory!' : 'Game Over'}
                </h2>
                <p className="mb-4">
                  {health > 0
                    ? 'You survived the darkness!'
                    : 'The light consumed you...'}
                </p>
                <button
                  className="game-button"
                  onClick={() => window.location.reload()}
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;