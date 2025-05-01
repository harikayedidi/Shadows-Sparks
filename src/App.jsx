import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './components/Card';
import GameOverModal from './components/GameOverModal';
import DeckStack from './components/CardBack';
import DrawCounter from './components/DrawCounter';
import HealthBar from './components/HealthBar';
import InventorySlot from './components/InventorySlot';
import GameLog from './components/GameLog';
import Instructions from './components/Instructions';
import ChoicePopup from './components/ChoicePopup';
import WelcomePopup from './components/WelcomePopup';
import ThemeSelector from './components/ThemeSelector';
import themes from './data/themes';
import { useGameState } from './hooks/useGameState';
import { useGameEffects } from './hooks/useGameEffects';
import { useInventory } from './hooks/useInventory';
import { useCardChoices } from './hooks/useCardChoices';
import { useCardManagement } from './hooks/useCardManagement';
import { useGameUI } from './hooks/useGameUI';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // Initialize theme and UI state
  const {
    showWelcome,
    closeWelcome,
    showInventory,
    revealInventory,
    isMobile,
    showInstructions,
    toggleInstructions,
    theme,
    setTheme,
    showThemeSelector,
    toggleThemeSelector
  } = useGameUI();

  // Initialize base game state
  const {
    health,
    setHealth,
    turns,
    setTurns,
    gameOver,
    setGameOver,
    gameResult,
    setGameResult,
    isEndless,
    setIsEndless,
    messages,
    isMuted,
    endlessStats,
    setEndlessStats,
    endlessModeUnlocked,
    setEndlessModeUnlocked,
    addMessage,
    toggleMute,
    resetGameState
  } = useGameState();

  // Create stable game state reference
  const gameStateRef = {
    health,
    setHealth,
    turns,
    setTurns,
    gameOver,
    gameResult,
    isEndless,
    setIsEndless,
    messages,
    isMuted,
    endlessStats,
    setEndlessStats,
    endlessModeUnlocked,
    setEndlessModeUnlocked,
    addMessage,
    resetGameState,
    setGameOver,
    setGameResult
  };

  // Initialize game systems in dependency order
  const gameEffects = useGameEffects(gameStateRef);
  const inventorySystem = useInventory(gameStateRef);
  const choiceSystem = useCardChoices(gameStateRef, { inventory: inventorySystem });
  const cardSystem = useCardManagement(
    gameStateRef,
    {
      inventory: inventorySystem,
      takeDamage: gameEffects.takeDamage,
      cardChoices: choiceSystem
    }
  );

  // Extract required values from systems
  const { inventory, useItem, resetInventory } = inventorySystem;
  const { choicePopup } = choiceSystem;
  const { deck, currentCard, isFlipped, drawCard, resetCardState, remainingDraws, STANDARD_DECK_SIZE } = cardSystem;

  // Handle theme selection
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('selectedTheme', newTheme.name.toLowerCase());
  };

  // Initialize game when component mounts
  useEffect(() => {
    let mounted = true;

    const initializeGame = async () => {
      try {
        if (mounted) {
          await Promise.all([
            resetGameState(false),
            resetInventory(),
            resetCardState()
          ]);
        }
      } catch (error) {
        console.error('Error initializing game:', error);
        if (mounted) {
          addMessage('Error starting game. Please try again.');
        }
      }
    };

    initializeGame();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="app-container">
          <motion.div
        className={`game-container ${theme?.particleType}-particles`}
        style={{
          background: "linear-gradient(to bottom, #1a1a2e, #162447)"
        }}
      >
        <div className="game-wrapper">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
              <h1 
                className="text-4xl md:text-6xl font-bold mb-4"
                style={{
                  textShadow: theme?.titleGlow || '0 0 30px rgba(255,255,255,0.3)'
                }}
              >
                Shadows & Sparks
              </h1>

              {/* How to Play Button - Moved to top */}
              <motion.button
                onClick={toggleInstructions}
                className="btn-utility mt-4 mb-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-expanded={showInstructions}
                aria-controls="game-instructions"
              >
                {showInstructions ? 'Hide Rules' : 'How to Play'}
              </motion.button>

              {/* Instructions Panel */}
              {showInstructions && (
                <Instructions 
                  isVisible={true}
                  onToggle={toggleInstructions}
                />
              )}

              <p className="text-xl text-gray-300 mb-4">
                A solo survival card game where you draw, decide, and survive 10 rounds of risk.
              </p>

              {/* Game Mode Display - Only show in standard mode */}
              {!isEndless && (
                <div className="px-6 py-2 rounded-full text-lg font-semibold mb-4
                              bg-blue-900/50 text-blue-300 border-2 border-blue-500/30">
                  <span>Standard Mode • {10 - turns} turns remaining</span>
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center items-center gap-4">
                <motion.button
                  onClick={toggleMute}
                  className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
                >
                  {isMuted ? '🔇' : '🔊'}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Game Content */}
          <div className="w-full max-w-2xl mx-auto">
            {/* Health and Inventory */}
            <div className="game-header">
              <div className="flex flex-col gap-4 w-full sm:w-72">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Health:</span>
                    <HealthBar health={health} maxHealth={5} />
                  </div>
                  <div className="deck-scale">
                    <DeckStack
                      count={deck.length}
                      theme={theme}
                      onDrawCard={drawCard}
                      isDisabled={gameOver || choicePopup.isOpen}
                      isEndless={isEndless}
                    />
                  </div>
                </div>
              </div>

              {/* Show inventory only after obtaining first item or if items exist */}
              {(showInventory || inventory.some(item => item !== null)) && (
                <div className="flex flex-col items-center sm:items-end">
                  <span className="text-base md:text-lg text-gray-400 mb-2">Inventory:</span>
                  <div className="flex card-spacing">
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
              )}
            </div>

            {/* Game Board */}
            <div className="game-content my-12 shadow-lg relative">
              {/* Draw Counter */}
              {/* <DrawCounter 
                current={remainingDraws}
                total={STANDARD_DECK_SIZE}
                theme={theme}
              /> */}

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
                    theme={theme}
                  />
                </motion.div>
              </AnimatePresence>

              <motion.button
                className="btn-primary relative overflow-hidden text-white font-bold text-shadow-lg pointer-events-auto"
                onClick={drawCard}
                onTouchStart={drawCard}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    drawCard();
                  }
                }}
                disabled={gameOver || choicePopup.isOpen}
                style={{
                  background: `linear-gradient(to bottom, ${theme?.particleColor}40, ${theme?.particleColor}20)`,
                  backdropFilter: 'blur(4px)',
                  transition: "all 0.3s ease",
                  textShadow: "0 2px 4px rgba(0,0,0,0.75)"
                }}
                whileHover={gameOver || choicePopup.isOpen ? {} : { scale: 1.05 }}
                whileTap={gameOver || choicePopup.isOpen ? {} : { scale: 0.95 }}
                tabIndex={gameOver || choicePopup.isOpen ? -1 : 0}
                aria-disabled={gameOver || choicePopup.isOpen}
              >
                <span className="relative z-10">Draw Card</span>
              </motion.button>

              <ThemeSelector
                currentTheme={theme}
                onSelectTheme={handleThemeChange}
                isOpen={showThemeSelector}
                onToggle={toggleThemeSelector}
              />

              <GameLog messages={messages} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlays Container */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Popups Container */}
        <div className="relative z-50 pointer-events-auto">
          {/* Welcome Popup */}
          <AnimatePresence>
            {showWelcome && (
              <div className="fixed inset-0 flex items-center justify-center">
                <WelcomePopup isOpen={true} onClose={closeWelcome} />
              </div>
            )}
          </AnimatePresence>

          {/* Choice Popup */}
          <AnimatePresence>
            {choicePopup.isOpen && (
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-lg">
                  <ChoicePopup {...choicePopup} />
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Game Over Modal */}
          <AnimatePresence>
            {gameOver && (
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <GameOverModal
                  isOpen={true}
                  gameResult={gameResult}
                  isEndless={isEndless}
                  endlessStats={endlessStats}
                  turns={turns}
                          onPlayAgain={async () => {
            try {
              // First reset game mode and state flags
              setIsEndless(false);
              setGameOver(false);
              setGameResult(null);
              
              // Then reset core stats
              setHealth(5);
              setTurns(0);
              
              // Finally reset all systems sequentially to ensure proper order
              await resetGameState(false);
              await resetInventory();
              await resetCardState();
              
              addMessage('Game restarted! Good luck!');
            } catch (error) {
              console.error('Error restarting game:', error);
              addMessage('Error restarting game. Please try again.');
              setGameOver(true);
            }
          }}
                  onStartEndless={async () => {
            if (!endlessModeUnlocked) {
              addMessage('Win a standard game first to unlock Endless Mode!');
              return;
            }
            try {
              // First set endless mode and reset state flags
              setIsEndless(true);
              setGameOver(false);
              setGameResult(null);
              
              // Then reset core stats
              setHealth(5);
              setTurns(0);
              
              // Finally reset all systems sequentially
              await resetGameState(true);
              await resetInventory();
              await resetCardState();
              
              addMessage('Welcome to Endless Mode! How long can you survive?');
            } catch (error) {
              console.error('Error starting endless mode:', error);
              addMessage('Error starting endless mode. Please try again.');
              setGameOver(true);
            }
          }}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;