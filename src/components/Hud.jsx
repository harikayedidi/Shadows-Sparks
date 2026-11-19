import { forwardRef } from 'react';
import { UPGRADES } from '../data/cards';
import { useMobile } from '../hooks/useMobile';
import IntegrityBar from './IntegrityBar';
import DepthMap from './DepthMap';

const Chip = ({ color, children, title }) => (
  <span
    className="font-mono text-xs tracking-widest px-2 py-0.5 whitespace-nowrap"
    style={{ color, border: `1px solid ${color}88`, boxShadow: `0 0 10px ${color}33` }}
    title={title}
  >
    {children}
  </span>
);

const Hud = forwardRef(function Hud(
  { hp, maxHp, accent, mode, difficulty, goal, depth, history, shield, oracle, corrupted, upgrades, pulse, dropActive, muted, onToggleMute, onHelp, onSettings, onMenu },
  integrityRef
) {
  const mobile = useMobile();
  return (
    <header className="panel flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-3 sm:px-5 py-3">
      <IntegrityBar ref={integrityRef} hp={hp} max={maxHp} accent={accent} pulse={pulse} dropActive={dropActive} />

      <div className="order-3 w-full lg:order-none lg:w-auto flex justify-center">
        <DepthMap mode={mode} difficulty={difficulty} goal={goal} depth={depth} history={history} />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1 items-end mr-1">
          {shield > 0 && <Chip color="#7cf7ff" title="Blocks bright traps">⬡ SHIELD{shield > 1 ? ` ×${shield}` : ''}</Chip>}
          {oracle > 0 && <Chip color="#c18bff" title="Tags are always right">◎ TRUE TAGS ×{oracle}</Chip>}
          {corrupted && <Chip color="#ff3c5a" title="Your next room will be a trap">⚠ CURSED</Chip>}
        </div>
        {mobile ? (
          <button className="icon-btn icon-btn-lg" onClick={onSettings} aria-label="Settings, help and quit" title="Settings">⚙</button>
        ) : (
          <>
            <button className="icon-btn" onClick={onToggleMute} aria-label={muted ? 'Turn sound on' : 'Turn sound off'} title="Sound (M)">
              {muted ? '🔇' : '🔊'}
            </button>
            <button className="icon-btn" onClick={onSettings} aria-label="Settings" title="Settings">⚙</button>
            <button className="icon-btn" onClick={onHelp} aria-label="How to play" title="How to play (H)">?</button>
            <button className="icon-btn" onClick={onMenu} aria-label="Quit to menu" title="Quit to menu">⏏</button>
          </>
        )}
      </div>

      {upgrades.length > 0 && (
        <div className="order-last w-full flex flex-wrap items-center gap-1.5" aria-label="Your upgrades">
          <span className="hud-label mr-1">Upgrades</span>
          {upgrades.map((id) => (
            <span
              key={id}
              className="font-mono text-xs px-2 py-0.5 bg-white/5 border border-white/10 text-slate-200"
              title={`${UPGRADES[id].title}: ${UPGRADES[id].text}`}
            >
              <span style={{ color: 'var(--accent)' }}>{UPGRADES[id].glyph}</span> {UPGRADES[id].title}
            </span>
          ))}
        </div>
      )}
    </header>
  );
});

export default Hud;
