import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useAnimationControls } from 'framer-motion';
import { accuracyText, difficultyOf } from '../game/engine';
import { useGame } from '../hooks/useGame';
import { useFx } from '../hooks/useFx';
import { useKeyboard } from '../hooks/useKeyboard';
import { useSettings } from '../hooks/useSettings';
import { useTips } from '../hooks/useTips';
import audio from '../utils/audio';
import Hud from './Hud';
import DeckScanner from './DeckScanner';
import DoorCard from './DoorCard';
import RoomCard from './RoomCard';
import ChoicePanel from './ChoicePanel';
import Inventory from './Inventory';
import TransmissionLog from './TransmissionLog';
import GameOverPanel from './GameOverPanel';
import UpgradePicker from './UpgradePicker';
import FloorBanner from './FloorBanner';
import Countdown from './Countdown';
import TipToast from './TipToast';

const FLASH = {
  damage: 'radial-gradient(circle, rgba(255,40,70,0.15), rgba(255,40,70,0.55))',
  heal: 'radial-gradient(circle, rgba(61,255,180,0.25), transparent 70%)',
  shield: 'radial-gradient(circle, rgba(124,247,255,0.35), transparent 70%)',
  item: 'radial-gradient(circle at 50% 100%, rgba(255,200,87,0.25), transparent 60%)',
  upgrade: 'radial-gradient(circle, var(--accent-soft), transparent 70%)',
  bossDown: 'radial-gradient(circle, rgba(61,255,180,0.3), transparent 70%)',
};

const numberKeys = (n) => Array.from({ length: n }, (_, i) => i + 1).join(' ');

function phasePrompt(state) {
  switch (state.phase) {
    case 'ready':
      if (state.boss) {
        const { locks } = state.boss;
        return [`${locks} more dark ${locks === 1 ? 'room' : 'rooms'} to beat the boss. Draw doors`, 'Space'];
      }
      return state.room ? ['Nice! Draw the next doors', 'Space'] : ['Draw doors: tap the deck', 'Space'];
    case 'choosing':
      if (state.twist === 'blackout') return ['Lights out! No tags. Pick a door', numberKeys(state.doors.length)];
      if (state.oracle > 0) return ['Tags are always right right now. Pick a door', numberKeys(state.doors.length)];
      return [`Pick a door. Tags are right about ${accuracyText(state)} times`, numberKeys(state.doors.length)];
    case 'revealing':
      return ['Opening…', null];
    case 'deciding':
      return ['Pick one', '1 2'];
    case 'upgrading':
      return ['Pick an upgrade', numberKeys(state.offer.length)];
    default:
      return ['', null];
  }
}

export default function GameScreen({ mode, difficulty, theme, muted, endlessUnlocked, hardUnlocked, best, paused, onToggleMute, onHelp, onSettings, onCloseHelp, onRestart, onMenu, onFinish }) {
  const [state, actions] = useGame(mode, difficulty);
  const level = difficultyOf(state);
  const pulse = useFx(state.fx);
  const { full, off } = useSettings();
  const [tip, dismissTip] = useTips(state);
  const shake = useAnimationControls();
  const integrityRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!full) return;
    if (pulse?.type === 'damage') {
      shake.start({ x: [0, -12, 10, -7, 5, -2, 0], y: [0, 5, -4, 3, -1, 0], transition: { duration: 0.5 } });
    } else if (pulse?.type === 'deny') {
      shake.start({ x: [0, -4, 4, -2, 0], transition: { duration: 0.25 } });
    }
  }, [pulse, shake, full]);

  useEffect(() => {
    audio.setTension(state.hp <= 1 ? 1 : state.hp <= 2 ? 0.7 : state.hp <= 3 ? 0.3 : 0);
  }, [state.hp]);

  useEffect(() => () => audio.setTension(0), []);

  useEffect(() => {
    if (!state.result || summary) return;
    const next = {
      newBest: mode === 'endless' && state.depth > best,
      justUnlocked: mode === 'standard' && state.result === 'victory' && !endlessUnlocked,
      hardJustUnlocked: mode === 'standard' && state.result === 'victory' && level.id !== 'easy' && !hardUnlocked,
    };
    setSummary(next);
    onFinish({ mode, difficulty: level.id, result: state.result, depth: state.depth });
  }, [state.result, state.depth, summary, mode, level.id, best, endlessUnlocked, hardUnlocked, onFinish]);

  const hasItems = state.inventory.some(Boolean);
  const over = state.phase === 'over';

  const pickNumber = (n) => {
    if (state.phase === 'choosing') {
      if (n < state.doors.length) actions.enter(n);
    } else if (state.phase === 'deciding') {
      const option = state.room.card.options[n];
      if (option && !(option.requiresItem && !hasItems)) actions.choose(n);
    } else if (state.phase === 'upgrading') {
      if (n < state.offer.length) actions.pickUpgrade(n);
    }
  };

  const unlessPaused = (fn) => () => !paused && fn();
  const draw = unlessPaused(() => state.phase === 'ready' && actions.deal());

  useKeyboard({
    space: draw,
    enter: draw,
    1: unlessPaused(() => pickNumber(0)),
    2: unlessPaused(() => pickNumber(1)),
    3: unlessPaused(() => pickNumber(2)),
    4: unlessPaused(() => pickNumber(3)),
    q: unlessPaused(() => actions.useItem(0)),
    w: unlessPaused(() => actions.useItem(1)),
    e: unlessPaused(() => actions.useItem(2)),
    r: unlessPaused(() => (over ? onRestart(mode) : actions.useItem(3))),
    m: onToggleMute,
    h: () => (paused ? onCloseHelp() : onHelp()),
    '?': onHelp,
    escape: onCloseHelp,
  });

  const [promptText, promptKeys] = phasePrompt(state);
  const showRoom = state.room && state.phase !== 'choosing' && state.phase !== 'upgrading';
  const countdown = state.phase === 'choosing' && state.twist === 'countdown';
  const doorStyle = state.doors.length > 3 ? { '--door-w': 'clamp(78px, 21vw, 160px)' } : undefined;

  return (
    <>
      <motion.div
        className="relative z-10 min-h-screen max-w-6xl mx-auto flex flex-col gap-3 sm:gap-4 p-3 sm:p-5"
        animate={shake}
      >
        <Hud
          ref={integrityRef}
          hp={state.hp}
          maxHp={state.maxHp}
          accent={theme.accent}
          mode={state.mode}
          difficulty={level.title}
          goal={state.goal}
          depth={state.depth}
          history={state.history}
          shield={state.shield}
          oracle={state.oracle}
          corrupted={state.corrupted}
          upgrades={state.upgrades}
          pulse={pulse}
          dropActive={dragState}
          muted={muted}
          onToggleMute={onToggleMute}
          onHelp={onHelp}
          onSettings={onSettings}
          onMenu={onMenu}
        />

        {!over && <FloorBanner boss={state.boss} twist={state.twist} />}

        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-10 py-2">
          <div className={state.phase === 'upgrading' ? 'hidden lg:block' : undefined}>
            <DeckScanner cardBack={theme.cardBack} ready={state.phase === 'ready'} onDeal={actions.deal} />
          </div>

          <div className="flex flex-col items-center gap-3 min-h-[calc(var(--card-h)+1rem)] justify-center" style={doorStyle}>
            {countdown && (
              <Countdown key={state.doors.map((d) => d.id).join()} seconds={level.timer} paused={paused} onDone={actions.timeout} />
            )}
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
                        compact={state.doors.length > 3}
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
                        <p className="hud-label mt-3">Draw doors</p>
                      </div>
                    </motion.div>
                  )}
                  {state.phase === 'deciding' && (
                    <ChoicePanel key="choice" card={state.room.card} hasItems={hasItems} onChoose={actions.choose} />
                  )}
                  {state.phase === 'upgrading' && <UpgradePicker key="upgrade" offer={state.offer} onPick={actions.pickUpgrade} />}
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
        {pulse && !off && FLASH[pulse.type] && (
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
          animate={{ opacity: full ? [0.35, 0.9, 0.35] : 0.6 }}
          transition={full ? { repeat: Infinity, duration: state.hp <= 1 ? 0.9 : 1.6 } : {}}
          aria-hidden="true"
        />
      )}

      <AnimatePresence>
        {over && summary && (
          <GameOverPanel
            result={state.result}
            mode={mode}
            difficulty={level.title}
            depth={state.depth}
            best={best}
            newBest={summary.newBest}
            justUnlocked={summary.justUnlocked}
            hardJustUnlocked={summary.hardJustUnlocked}
            history={state.history}
            upgrades={state.upgrades}
            endlessUnlocked={endlessUnlocked || summary.justUnlocked}
            onRestart={onRestart}
            onEndless={() => onRestart('endless')}
            onMenu={onMenu}
          />
        )}
      </AnimatePresence>

      <TipToast tip={over || paused ? null : tip} onDismiss={dismissTip} />
    </>
  );
}
