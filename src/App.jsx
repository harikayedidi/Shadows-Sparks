import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import themes from './data/themes';
import audio from './utils/audio';
import { useKeyboard } from './hooks/useKeyboard';
import Atmosphere from './components/Atmosphere';
import TitleScreen from './components/TitleScreen';
import GameScreen from './components/GameScreen';
import HelpModal from './components/HelpModal';

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode); progress just won't persist.
  }
};

// Earlier versions stored progress under different keys.
const legacyUnlocked = () => load('hasWonStandardMode', false) === true;
const legacyBest = () => load('endlessStats', {})?.highScore ?? 0;

export default function App() {
  const [themeId, setThemeId] = useState(() => {
    const saved = load('ss.theme', 'frozen');
    return themes[saved] ? saved : 'frozen';
  });
  const [muted, setMuted] = useState(() => load('ss.muted', false));
  const [endlessUnlocked, setEndlessUnlocked] = useState(() => load('ss.unlocked', false) || legacyUnlocked());
  const [best, setBest] = useState(() => load('ss.best', 0) || legacyBest());
  const [run, setRun] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const theme = themes[themeId];

  useEffect(() => save('ss.theme', themeId), [themeId]);
  useEffect(() => save('ss.unlocked', endlessUnlocked), [endlessUnlocked]);
  useEffect(() => save('ss.best', best), [best]);
  useEffect(() => {
    save('ss.muted', muted);
    audio.setMuted(muted);
  }, [muted]);
  useEffect(() => audio.startAmbient(theme), [theme]);

  const toggleMute = useCallback(() => {
    audio.unlock();
    setMuted((m) => !m);
  }, []);

  const start = useCallback(
    (mode) => {
      if (mode === 'endless' && !endlessUnlocked) return;
      audio.unlock();
      audio.startAmbient(theme);
      audio.blip('select');
      setRun({ mode, id: Date.now() });
    },
    [endlessUnlocked, theme]
  );

  const selectTheme = useCallback(
    (id) => {
      audio.unlock();
      audio.blip('select');
      setThemeId(id);
    },
    []
  );

  const finish = useCallback(({ mode, result, depth }) => {
    if (mode === 'standard' && result === 'victory') setEndlessUnlocked(true);
    if (mode === 'endless') setBest((b) => Math.max(b, depth));
  }, []);

  const openHelp = useCallback(() => setShowHelp(true), []);
  const closeHelp = useCallback(() => setShowHelp(false), []);
  const toMenu = useCallback(() => setRun(null), []);

  useKeyboard(
    {
      enter: () => !showHelp && start('standard'),
      m: toggleMute,
      h: () => setShowHelp((s) => !s),
      '?': openHelp,
      escape: closeHelp,
    },
    !run
  );

  return (
    <>
      <Atmosphere theme={theme} />
      <AnimatePresence mode="wait">
        {run ? (
          <motion.div key={run.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <GameScreen
              mode={run.mode}
              theme={theme}
              muted={muted}
              endlessUnlocked={endlessUnlocked}
              best={best}
              showHelp={showHelp}
              onToggleMute={toggleMute}
              onHelp={openHelp}
              onCloseHelp={closeHelp}
              onRestart={start}
              onMenu={toMenu}
              onFinish={finish}
            />
          </motion.div>
        ) : (
          <TitleScreen
            key="title"
            themes={themes}
            theme={theme}
            onSelectTheme={selectTheme}
            onStart={start}
            endlessUnlocked={endlessUnlocked}
            best={best}
            muted={muted}
            onToggleMute={toggleMute}
            onHelp={openHelp}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>{showHelp && <HelpModal onClose={closeHelp} />}</AnimatePresence>
    </>
  );
}
