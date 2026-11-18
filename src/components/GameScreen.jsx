import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useAnimationControls } from 'framer-motion';
import { MAX_HP } from '../game/engine';
import { useGame } from '../hooks/useGame';
import { useFx } from '../hooks/useFx';
import { useKeyboard } from '../hooks/useKeyboard';
import audio from '../utils/audio';
import Hud from './Hud';
import DeckScanner from './DeckScanner';
import DoorCard from './DoorCard';
import RoomCard from './RoomCard';
import ChoicePanel from './ChoicePanel';
import Inventory from './Inventory';
import TransmissionLog from './TransmissionLog';
import GameOverPanel from './GameOverPanel';

const FLASH = {
  damage: 'radial-gradient(circle, rgba(255,40,70,0.15), rgba(255,40,70,0.55))',
  heal: 'radial-gradient(circle, rgba(61,255,180,0.25), transparent 70%)',
  shield: 'radial-gradient(circle, rgba(124,247,255,0.35), transparent 70%)',
  item: 'radial-gradient(circle at 50% 100%, rgba(255,200,87,0.25), transparent 60%)',
};

function phasePrompt(state) {
  switch (state.phase) {
    case 'ready':
      return state.room ? ['Sector cleared. Scan onward', 'Space'] : ['Scan the next sector: click or drag the scanner', 'Space'];
    case 'choosing':
      return ['Choose a door: click, drag it up, or press', '1 2 3'];
    case 'revealing':
      return ['Entering…', null];
    case 'deciding':
      return ['Answer the signal', '1 2'];
    default:
      return ['', null];
  }
}

export default function GameScreen({ mode, theme, muted, endlessUnlocked, best, showHelp, onToggleMute, onHelp, onCloseHelp, onRestart, onMenu, onFinish }) {
  const [state, actions] = useGame(mode);
  const pulse = useFx(state.fx);
  const shake = useAnimationControls();
  const integrityRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (pulse?.type === 'damage') {
      shake.start({ x: [0, -12, 10, -7, 5, -2, 0], y: [0, 5, -4, 3, -1, 0], transition: { duration: 0.5 } });
    } else if (pulse?.type === 'deny') {
      shake.start({ x: [0, -4, 4, -2, 0], transition: { duration: 0.25 } });
    }
  }, [pulse, shake]);

  useEffect(() => {
    audio.setTension(state.hp <= 1 ? 1 : state.hp <= 2 ? 0.7 : state.hp <= 3 ? 0.3 : 0);
  }, [state.hp]);

  useEffect(() => () => audio.setTension(0), []);

  useEffect(() => {
    if (!state.result || summary) return;
    const next = {
      newBest: mode === 'endless' && state.depth > best,
      justUnlocked: mode === 'standard' && state.result === 'victory' && !endlessUnlocked,
    };
    setSummary(next);
    onFinish({ mode, result: state.result, depth: state.depth });
  }, [state.result, state.depth, summary, mode, best, endlessUnlocked, onFinish]);

  const hasItems = state.inventory.some(Boolean);
  const over = state.phase === 'over';

  const pickNumber = (n) => {
    if (state.phase === 'choosing') actions.enter(n);
    else if (state.phase === 'deciding') {
      const option = state.room.card.options[n];
      if (option && !(option.requiresItem && !hasItems)) actions.choose(n);
    }
  };

  useKeyboard({
    space: () => !showHelp && state.phase === 'ready' && actions.deal(),
    enter: () => !showHelp && state.phase === 'ready' && actions.deal(),
    1: () => !showHelp && pickNumber(0),
    2: () => !showHelp && pickNumber(1),
    3: () => !showHelp && pickNumber(2),
    q: () => !showHelp && actions.useItem(0),
    w: () => !showHelp && actions.useItem(1),
    e: () => !showHelp && actions.useItem(2),
    r: () => over && onRestart(mode),
    m: onToggleMute,
    h: () => (showHelp ? onCloseHelp() : onHelp()),
    '?': onHelp,
    escape: onCloseHelp,
  });

  const [promptText, promptKeys] = phasePrompt(state);
  const showRoom = state.room && state.phase !== 'choosing';

  return (
    <>
      <motion.div
        className="relative z-10 min-h-screen max-w-6xl mx-auto flex flex-col gap-3 sm:gap-4 p-3 sm:p-5"
        animate={shake}
      >
        <Hud
          ref={integrityRef}
          hp={state.hp}
          maxHp={MAX_HP}
          accent={theme.accent}
          mode={state.mode}
          goal={state.goal}
          depth={state.depth}
          history={state.history}
          shield={state.shield}
          oracle={state.oracle}
          corrupted={state.corrupted}
          pulse={pulse}
          dropActive={dragState}
          muted={muted}
          onToggleMute={onToggleMute}
          onHelp={onHelp}
          onMenu={onMenu}
        />

        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-10 py-2">
          <DeckScanner cardBack={theme.cardBack} ready={state.phase === 'ready'} onDeal={actions.deal} />

          <div className="flex flex-col items-center gap-3 min-h-[calc(var(--card-h)+1rem)] justify-center">
            <LayoutGroup>
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-5">
                <AnimatePresence mode="popLayout">
                  {state.phase === 'choosing' &&
                    state.doors.map((door, i) => (
                      <DoorCard
                        key={door.id}
                        door={door}
                        index={i}
                        cardBack={theme.cardBack}
                        corrupted={state.corrupted}
                        onEnter={actions.enter}
                        onHover={() => audio.blip('hover')}
                      />
                    ))}
                  {showRoom && (
                    <RoomCard
                      key={state.room.card.uid}
                      card={state.room.card}
                      cardBack={theme.cardBack}
                      corrupted={state.room.corrupted}
                      dim={state.phase === 'ready'}
                    />
                  )}
                  {!showRoom && state.phase === 'ready' && (
                    <motion.div
                      key="idle"
                      className="card-shape grid place-items-center text-center p-4 border border-dashed"
                      style={{ width: 'var(--card-w)', height: 'var(--card-h)', borderColor: 'var(--accent-soft)', background: 'rgba(0,0,0,0.25)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div>
                        <div className="text-3xl neon-text">◇</div>
                        <p className="hud-label mt-3">Awaiting scan</p>
                      </div>
                    </motion.div>
                  )}
                  {state.phase === 'deciding' && (
                    <ChoicePanel key="choice" card={state.room.card} hasItems={hasItems} onChoose={actions.choose} />
                  )}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          </div>
        </main>

        <p className="text-center hud-label min-h-[1.25rem]" aria-live="polite">
          {promptText} {promptKeys && promptKeys.split(' ').map((k) => <kbd key={k} className="ml-1">{k}</kbd>)}
        </p>

        <footer className="grid md:grid-cols-[auto_1fr] gap-3">
          <Inventory items={state.inventory} dropTargetRef={integrityRef} onUse={actions.useItem} onDragState={setDragState} />
          <TransmissionLog entries={state.log} />
        </footer>
      </motion.div>

      <AnimatePresence>
        {pulse && FLASH[pulse.type] && (
          <motion.div
            key={pulse.id}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 57, background: FLASH[pulse.type] }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: pulse.type === 'damage' ? 0.55 : 0.8 }}
          />
        )}
      </AnimatePresence>

      {state.hp <= 2 && !over && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 56, boxShadow: 'inset 0 0 140px rgba(255, 40, 70, 0.5)' }}
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ repeat: Infinity, duration: state.hp <= 1 ? 0.9 : 1.6 }}
          aria-hidden="true"
        />
      )}

      <AnimatePresence>
        {over && summary && (
          <GameOverPanel
            result={state.result}
            mode={mode}
            depth={state.depth}
            best={best}
            newBest={summary.newBest}
            justUnlocked={summary.justUnlocked}
            history={state.history}
            endlessUnlocked={endlessUnlocked || summary.justUnlocked}
            onRestart={onRestart}
            onEndless={() => onRestart('endless')}
            onMenu={onMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
}
