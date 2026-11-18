import { motion } from 'framer-motion';
import Typewriter from './Typewriter';

export default function TitleScreen({
  themes,
  theme,
  onSelectTheme,
  onStart,
  endlessUnlocked,
  best,
  muted,
  onToggleMute,
  onHelp,
}) {
  return (
    <motion.main
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="icon-btn" onClick={onToggleMute} aria-label={muted ? 'Unmute' : 'Mute'} title="Sound (M)">
          {muted ? '🔇' : '🔊'}
        </button>
        <button className="icon-btn" onClick={onHelp} aria-label="How to play" title="How to play (H)">
          ?
        </button>
      </div>

      <p className="hud-label mb-4">Lumen Spire // Containment breach detected</p>

      <h1
        className="glitch neon-text font-display font-black tracking-wider text-5xl sm:text-7xl md:text-8xl leading-none"
        data-text="SHADOWS & SPARKS"
      >
        SHADOWS &amp; SPARKS
      </h1>

      <p className="mt-6 max-w-xl text-lg sm:text-xl text-slate-300 min-h-[3.5rem]">
        <Typewriter
          text="You are SPARK, a rogue android. Light sensors burn you. Darkness hides you. Climb ten sublevels to the surface."
          speed={18}
        />
      </p>

      <section className="mt-10 w-full max-w-3xl" aria-label="Choose sector">
        <p className="hud-label mb-3">Select sector</p>
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {Object.values(themes).map((t) => {
            const active = t.id === theme.id;
            return (
              <motion.button
                key={t.id}
                onClick={() => onSelectTheme(t.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                aria-pressed={active}
                className="panel text-left p-2 sm:p-3 group"
                style={{
                  outline: active ? `2px solid ${t.accent}` : 'none',
                  boxShadow: active ? `0 0 30px ${t.accentSoft}` : undefined,
                }}
              >
                <div
                  className="h-20 sm:h-28 w-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundImage: `url(${t.cardBack})` }}
                />
                <div className="mt-2 font-display text-xs sm:text-sm tracking-widest" style={{ color: t.accent }}>
                  {t.name}
                </div>
                <div className="hidden sm:block text-xs text-slate-400">{t.tagline}</div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
        <button className="btn-neon text-sm sm:text-base" onClick={() => onStart('standard')}>
          Begin infiltration <kbd className="ml-2 !text-black !border-black/40 !bg-black/10">Enter</kbd>
        </button>
        <button
          className="btn-ghost text-sm"
          onClick={() => onStart('endless')}
          disabled={!endlessUnlocked}
          title={endlessUnlocked ? 'Endless descent' : 'Escape the Spire once to unlock'}
        >
          {endlessUnlocked ? `Endless descent${best ? ` · best ${best}` : ''}` : '🔒 Endless descent'}
        </button>
      </div>
      {!endlessUnlocked && <p className="mt-3 text-xs text-slate-500">Escape the Spire once to unlock Endless.</p>}

      <p className="mt-12 hud-label flex flex-wrap justify-center gap-x-4 gap-y-2">
        <span><kbd>Space</kbd> scan</span>
        <span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> choose</span>
        <span><kbd>Q</kbd><kbd>W</kbd><kbd>E</kbd> items</span>
        <span><kbd>M</kbd> sound</span>
      </p>
    </motion.main>
  );
}
