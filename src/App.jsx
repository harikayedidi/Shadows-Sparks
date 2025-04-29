import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './components/Card';
import HealthBar from './components/HealthBar';
import InventorySlot from './components/InventorySlot';
import GameLog from './components/GameLog';
import Instructions from './components/Instructions';
import ChoicePopup from './components/ChoicePopup';
import { createDeck } from './data/cards';
import audioManager from './utils/audio';

function App() {
  const [health, setHealth] = useState(5);
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [inventory, setInventory] = useState([null, null]);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState([
    'Welcome to Shadows & Sparks! 🌓',
    'Survive 10 rounds to win!'
  ]);
  const [turns, setTurns] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'victory' or 'defeat'
  const [choicePopup, setChoicePopup] = useState({
    isOpen: false,
    options: [],
    onChoice: null
  });

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const toggleMute = () => {
    const newMuted = audioManager.toggleMute();
    setIsMuted(newMuted);
  };

  const [skipNextTurn, setSkipNextTurn] = useState(false);
  const [peeksRemaining, setPeeksRemaining] = useState(2);

  const handleChoiceAction = (choice) => {
    switch (choice.action) {
      case 'skip':
        setSkipNextTurn(true);
        addMessage('You hide in the shadows, skipping your next turn.');
        audioManager.play('itemUse');
        break;

      case 'damage':
        takeDamage(1);
        addMessage('You endure the light, taking reduced damage.');
        audioManager.play('damage');
        break;

      case 'heal':
        setHealth(h => Math.min(5, h + 1));
        addMessage('You feel rejuvenated! (+1 HP)');
        audioManager.play('itemUse');
        break;

      case 'draw':
        addMessage('You choose to draw another card...');
        audioManager.play('cardFlip');
        setTimeout(() => drawCard(), 500); // Slight delay for better UX
        break;

      case 'peek':
        if (peeksRemaining > 0 && deck.length > 0) {
          setPeeksRemaining(prev => prev - 1);
          const nextCard = deck[deck.length - 1];
          addMessage(`Peek (${peeksRemaining - 1} left): Next card is ${nextCard.title}`);
          audioManager.play('itemUse');
        }
        break;

      case 'roll_even':
        const roll = Math.floor(Math.random() * 6) + 1;
        addMessage(`🎲 You rolled a ${roll}!`);
        if (roll % 2 === 0) {
          addMessage('Even roll - You avoid the danger!');
          audioManager.play('itemUse');
        } else {
          addMessage('Odd roll - Bad luck!');
          audioManager.play('damage');
          takeDamage(1);
        }
        break;

      case 'roll_agility':
        const agility = Math.random() > 0.5;
        if (agility) {
          setHealth(h => Math.min(5, h + 1));
          addMessage('✨ Perfect agility! Gained 1 HP.');
          audioManager.play('itemUse');
        } else {
          addMessage('❌ Failed the agility check!');
          audioManager.play('damage');
          takeDamage(1);
        }
        break;

      case 'nothing':
        addMessage('You remain still. The danger passes.');
        break;
    }

    // Close the popup after handling the action
    setChoicePopup(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const drawCard = () => {
    if (gameOver || deck.length === 0) return;

    // Check if should skip this turn
    if (skipNextTurn) {
      setSkipNextTurn(false);
      addMessage('Turn skipped (hiding in shadows).');
      return;
    }
    
    audioManager.play('cardFlip');

    const newDeck = [...deck];
    const drawnCard = newDeck.pop();
    setDeck(newDeck);
    setCurrentCard(drawnCard);
    setIsFlipped(true);
    setTurns(t => t + 1);

    // If card has choices, show popup immediately
    if (drawnCard.hasChoice) {
      setChoicePopup({
        isOpen: true,
        title: drawnCard.description,
        choices: drawnCard.choices,
        onChoice: handleChoiceAction
      });
    } else {
      handleCardEffect(drawnCard);
    }
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
        setGameResult('defeat');
        audioManager.play('defeat');
        addMessage('Game Over! The darkness claims another victim...');
      }
      return newHealth;
    });
    audioManager.play('damage');
    addMessage(`Lost ${amount} HP from a light trap!`);
  };

  const addToInventory = (item) => {
    const slot = inventory.findIndex(i => i === null);
    if (slot !== -1) {
      const newInventory = [...inventory];
      newInventory[slot] = item;
      setInventory(newInventory);
      addMessage(`Found a useful ${item.title}!`);
    } else {
      addMessage('Inventory is full!');
    }
  };

  const openChoicePopup = (options, onChoice) => {
    setChoicePopup({
      isOpen: true,
      options,
      onChoice: (choice) => {
        onChoice(choice);
        closeChoicePopup();
      }
    });
  };

  const closeChoicePopup = () => {
    setChoicePopup({
      isOpen: false,
      options: [],
      onChoice: null
    });
  };

  const handleSpecialEvent = (card) => {
    if (card.hasChoice) {
      setChoicePopup({
        isOpen: true,
        title: card.description,
        description: card.title,
        choices: card.choices,
        onChoice: handleChoice
      });
    } else {
      // Default behavior for events without choices
      takeDamage(1);
      addMessage(`${card.title}: ${card.description}`);
    }
  };

  const useItem = (item, slot) => {
    const newInventory = [...inventory];
    newInventory[slot] = null;
    setInventory(newInventory);

    audioManager.play('itemUse');
    
    switch (item.use) {
      case 'heal':
        setHealth(h => Math.min(5, h + 2));
        addMessage(`Used ${item.title} - Healed 2 HP!`);
        break;
      case 'preventDamage':
        addMessage(`Used ${item.title}!`);
        break;
      default:
        addMessage(`Used ${item.title}!`);
    }
  };

  const checkWinCondition = () => {
    if (turns >= 10 && health > 0) {
      setGameOver(true);
      setGameResult('victory');
      audioManager.play('victory');
      addMessage('Victory! You mastered the shadows!');
    }
  };

  useEffect(() => {
    checkWinCondition();
  }, [turns]);

  return (
    <motion.div 
      className="game-container"
      animate={gameResult === 'victory' ? {
        background: "linear-gradient(to bottom, #1a1a2e, #162447)"
      } : gameResult === 'defeat' ? {
        background: "linear-gradient(to bottom, #1a0f0f, #2d1717)"
      } : {}}
      transition={{ duration: 1 }}
    >
      <div className="game-wrapper">
        {/* Game Header */}
        <motion.div 
          className="text-center mb-8"
          animate={gameResult === 'victory' ? { y: [0, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4">
            <div className="text-center flex-1">
              <h1 className="game-title">Shadows & Sparks</h1>
              <p className="game-subtitle">Survive the darkness, avoid the light!</p>
            </div>
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </motion.div>

        {/* Main Game Content */}
        <div className="w-full max-w-2xl mx-auto">
          {/* Status Bar */}
          <div className="game-header">
            {/* Left side: Health and Instructions */}
            <div className="flex flex-col gap-4 w-full sm:w-72">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Health:</span>
                <HealthBar health={health} maxHealth={5} />
              </div>
              {/* <Instructions /> */}
            </div>

            {/* Right side: Inventory */}
            <div className="flex flex-col items-center sm:items-end">
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

          {/* Game Board */}
          <div className="game-content my-8 shadow-lg relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard?.id || 'empty'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full flex justify-center"
              >
                <Card 
                  card={currentCard} 
                  isFlipped={isFlipped} 
                  isVictory={gameResult === 'victory'}
                  isDefeat={gameResult === 'defeat'}
                />
              </motion.div>
            </AnimatePresence>

            <motion.button
              className="game-button"
              onClick={drawCard}
              disabled={gameOver || choicePopup.isOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Draw card, ${10 - turns} turns remaining`}
            >
              Draw Card ({10 - turns} remaining)
            </motion.button>

            <GameLog messages={messages} />
          </div>
        </div>

        <Instructions />
      </div>

      {/* Choice Popup - Positioned above the card */}
      <AnimatePresence>
        {choicePopup.isOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="flex items-center justify-center h-full">
              <div className="pointer-events-auto w-full max-w-lg px-4">
                <ChoicePopup {...choicePopup} />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-over-title"
          >
            <motion.div 
              className="bg-gray-800/90 p-8 rounded-xl text-center max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.h2
                id="game-over-title"
                className={`text-3xl font-bold mb-4 ${gameResult === 'victory' ? 'text-yellow-400' : 'text-red-400'}`}
                animate={gameResult === 'victory' ? {
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.5, repeat: Infinity, repeatDelay: 1 }
                } : {}}
              >
                {gameResult === 'victory' ? '🎉 Victory!' : '💔 Game Over'}
              </motion.h2>
              <p className="mb-6 text-lg">
                {gameResult === 'victory'
                  ? 'You survived the darkness!'
                  : 'The light consumed you...'}
              </p>
              <motion.button
                className="game-button"
                onClick={() => window.location.reload()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Play again"
              >
                Play Again
              </motion.button>

              {/* Victory particles */}
              {gameResult === 'victory' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      animate={{
                        x: [0, Math.random() * 200 - 100],
                        y: [0, Math.random() * 200 - 100],
                        scale: [1, 0],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;