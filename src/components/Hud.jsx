import { forwardRef } from 'react';
import IntegrityBar from './IntegrityBar';
import DepthMap from './DepthMap';

const Chip = ({ color, children, title }) => (
  <span
    className="font-mono text-[10px] sm:text-xs tracking-widest px-2 py-0.5"
    style={{ color, border: `1px solid ${color}88`, boxShadow: `0 0 10px ${color}33` }}
    title={title}
  >
    {children}
  </span>
);

const Hud = forwardRef(function Hud(
  { hp, maxHp, accent, mode, goal, depth, history, shield, oracle, corrupted, pulse, dropActive, muted, onToggleMute, onHelp, onMenu },
  integrityRef
) {
  return (
    <header className="panel flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-3 sm:px-5 py-3">
      <IntegrityBar ref={integrityRef} hp={hp} max={maxHp} accent={accent} pulse={pulse} dropActive={dropActive} />

      <div className="order-3 w-full lg:order-none lg:w-auto flex justify-center">
        <DepthMap mode={mode} goal={goal} depth={depth} history={history} />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1 items-end mr-1">
          {shield && <Chip color="#7cf7ff" title="Absorbs the next light trap">⬡ SHIELD</Chip>}
          {oracle > 0 && <Chip color="#c18bff" title="Sensors read true">◎ ORACLE ×{oracle}</Chip>}
          {corrupted && <Chip color="#ff3c5a" title="Your next room becomes a trap">⚠ CORRUPTED</Chip>}
        </div>
        <button className="icon-btn" onClick={onToggleMute} aria-label={muted ? 'Unmute' : 'Mute'} title="Sound (M)">
          {muted ? '🔇' : '🔊'}
        </button>
        <button className="icon-btn" onClick={onHelp} aria-label="How to play" title="How to play (H)">?</button>
        <button className="icon-btn" onClick={onMenu} aria-label="Abort to title" title="Abort to title">⏏</button>
      </div>
    </header>
  );
});

export default Hud;
