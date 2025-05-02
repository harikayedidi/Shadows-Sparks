import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./components/Card";
import GameOverModal from "./components/GameOverModal";
import DeckStack from "./components/DeckStack";
import DrawCounter from "./components/DrawCounter";
import HealthBar from "./components/HealthBar";
import InventorySlot from "./components/InventorySlot";
import GameLog from "./components/GameLog";
import Instructions from "./components/Instructions";
import ChoicePopup from "./components/ChoicePopup";
import ThemeSelector from "./components/ThemeSelector";
import themes from "./data/themes";
import { useGameState } from "./hooks/useGameState";
import { useGameEffects } from "./hooks/useGameEffects";
import { useInventory } from "./hooks/useInventory";
import { useCardChoices } from "./hooks/useCardChoices";
import { useCardManagement } from "./hooks/useCardManagement";
import { useGameUI } from "./hooks/useGameUI";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  // Initialize theme and UI state
  const {
    showInventory,
    showInstructions,
    toggleInstructions,
    theme,
    setTheme,
    showThemeSelector,
    toggleThemeSelector,
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
    resetGameState,
    incrementTurn,
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
    setGameResult,
    incrementTurn,
  };

  // Initialize game systems in dependency order
  const gameEffects = useGameEffects(gameStateRef);
  const inventorySystem = useInventory(gameStateRef);
  const choicesRef = useRef(null);

  const cardSystem = useCardManagement(gameStateRef, {
    inventory: inventorySystem,
    takeDamage: gameEffects.takeDamage,
    cardChoices: choicesRef,
  });

  const choiceSystem = useCardChoices(gameStateRef, {
    inventory: inventorySystem,
  });

  // Update ref with choice system
  choicesRef.current = choiceSystem;

  // Extract required values from systems
  const { inventory, useItem, resetInventory } = inventorySystem;
  const { choicePopup } = choiceSystem;
  const { deck, currentCard, isFlipped, drawCard, resetCardState } = cardSystem;

  // Handle theme selection
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("selectedTheme", newTheme.name.toLowerCase());
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
            resetCardState(),
          ]);
        }
      } catch (error) {
        console.error("Error initializing game:", error);
        if (mounted) {
          addMessage("Error starting game. Please try again.");
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
            background: "linear-gradient(to bottom, #1a1a2e, #162447)",
          }}
        >
          <div className="game-wrapper">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
                <h1
                  className="text-4xl md:text-6xl font-bold mb-4"
                  style={{
                    textShadow:
                      theme?.titleGlow || "0 0 30px rgba(255,255,255,0.3)",
                  }}
                >
                  Shadows & Sparks
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  A solo survival card game where you draw, decide, and survive
                  10 rounds of risk.
                </p>
                {/* Controls and Theme */}
                {/* <div className="flex justify-center items-center gap-4 mb-4 ml-30 sm:ml-4"> */}
                  <motion.button
                    onClick={toggleMute}
                    className="p-3 rounded-lg bg-gray-700/80 hover:bg-gray-600/80 transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={
                      isMuted ? "Unmute sound effects" : "Mute sound effects"
                    }
                  >
                    {isMuted ? "🔇" : "🔊"}
                  </motion.button>
                  <ThemeSelector
                    currentTheme={theme}
                    onSelectTheme={handleThemeChange}
                    isOpen={showThemeSelector}
                    onToggle={toggleThemeSelector}
                  />
                {/* </div> */}

                {/* How to Play Button */}
                <motion.button
                  onClick={toggleInstructions}
                  className="btn-primary mt-2 mb-8"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-expanded={showInstructions}
                  aria-controls="game-instructions"
                >
                  {showInstructions ? "Hide Instructions" : "How to Play"}
                </motion.button>

                {/* Instructions Panel */}
                {showInstructions && (
                  <Instructions
                    isVisible={true}
                    onToggle={toggleInstructions}
                  />
                )}
              </div>
            </div>

            {/* Game Board */}
                  <div className="deck-area game-content py-4 sm:py-8 relative">
                    {/* Game Content */}
                    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
                      <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                        {/* Game Mode Display */}
                        <div className="text-xl sm:text-2xl py-1 shadow inline-flex items-center gap-2">
                          <span className="text-white">
                            {isEndless ? ("Endless Mode • " + turns + " turns survived") : ("Standard Mode • " + (10 - turns) + " turns remaining")}
                          </span>
                        </div>
                        {/* Centered Health Bar */}
                        <div className="my-4 sm:my-8">
                          <HealthBar health={health} maxHealth={5} />
                        </div>
                      </div>
      
                      {/* Game Area with Deck and Current Card */}
                      <div className="flex flex-col items-center gap-4 sm:gap-8">
                        {/* Deck and Current Card Row */}
                        <div className="flex justify-center items-start gap-4 sm:gap-12 w-full">
                          {/* Left Side - Deck */}
                          <div className="flex flex-col items-center">
                            <span className="text-sm xs:text-lg sm:text-lg font-semibold opacity-70 mb-2 sm:mb-6 text-center">
                              Draw (Click the Deck)
                            </span>
                            <div className="relative">
                        <DeckStack
                          count={deck.length}
                          theme={theme}
                          onDrawCard={drawCard}
                          isDisabled={gameOver || choicePopup.isOpen}
                          isEndless={isEndless}
                        />
                      </div>
                    </div>

                    {/* Right Side - Current Card */}
                    <div className="relative mt-6 sm:mt-10 ml-2">
                      <AnimatePresence mode="wait">
                        <Card
                          card={currentCard}
                          isFlipped={isFlipped}
                          isVictory={gameResult === "victory"}
                          isDefeat={gameResult === "defeat"}
                          theme={theme}
                        />
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Inventory Below */}
                  {(showInventory ||
                    inventory.some((item) => item !== null)) && (
                    <div className="flex flex-col items-center w-full mt-4">
                      <span className="text-sm font-semibold opacity-70 mb-2">
                        Inventory
                      </span>
                      <div className="flex justify-center gap-4">
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
              </div>
            </div>
          </div>
          {/* Draw Counter */}
          <div className="w-full max-w-4xl mx-auto px-4 mt-4">
            <GameLog messages={messages} />
          </div>
        </motion.div>

        {/* Overlays Container */}
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Popups Container */}
          <div className="relative z-50 pointer-events-auto">
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
                        // Always reset to standard mode
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

                        addMessage("Game restarted! Good luck!");
                      } catch (error) {
                        console.error("Error restarting game:", error);
                        addMessage("Error restarting game. Please try again.");
                        setGameOver(true);
                      }
                    }}
                    onStartEndless={async () => {
                      if (!endlessModeUnlocked) {
                        addMessage(
                          "Win a standard game first to unlock Endless Mode!"
                        );
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

                        addMessage(
                          "Welcome to Endless Mode! How long can you survive?"
                        );
                      } catch (error) {
                        console.error("Error starting endless mode:", error);
                        addMessage(
                          "Error starting endless mode. Please try again."
                        );
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
