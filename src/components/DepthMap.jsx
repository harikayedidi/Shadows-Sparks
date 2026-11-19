import { motion } from 'framer-motion';
import { KIND_STYLE } from '../data/themes';
import { useSettings } from '../hooks/useSettings';

const nodeColor = (entry) => {
  if (!entry) return null;
  if (entry.kind === 'cloak') return 'var(--accent)';
  return KIND_STYLE[entry.kind]?.color ?? '#888';
};

const isBoss = (d) => (d + 1) % 5 === 0;

// The climb so far: each floor is colored by what you found there. Boss floors are marked.
export default function DepthMap({ mode, difficulty, goal, depth, history }) {
  const { full } = useSettings();
  const nodes =
    mode === 'endless'
      ? Array.from({ length: 10 }, (_, i) => Math.max(0, depth - 7) + i).map((d) => ({
          key: d,
          label: `F${d + 1}`,
          boss: isBoss(d),
          entry: history[d],
          current: d === depth,
          exit: false,
        }))
      : [
          ...Array.from({ length: goal }, (_, d) => ({
            key: d,
            label: `F${d + 1}`,
            boss: isBoss(d),
            entry: history[d],
            current: d === depth,
            exit: false,
          })),
          { key: 'exit', label: 'ROOF', entry: null, current: depth >= goal, exit: true },
        ];

  return (
    <div className="flex flex-col gap-1 min-w-0" aria-label={goal && depth >= goal ? 'Escaped' : `Floor ${depth + 1}${goal ? ` of ${goal}` : ''}`}>
      <span className="hud-label">
        {mode === 'endless' ? `Floor ${depth + 1}` : depth >= goal ? 'Escaped!' : `Floor ${depth + 1} of ${goal}`}
        {difficulty && <span className="text-slate-300"> · {difficulty}</span>}
      </span>
      <div className="flex items-center">
        {nodes.map((node, i) => {
          const color = nodeColor(node.entry);
          return (
            <div key={node.key} className="flex items-center">
              {i > 0 && (
                <div
                  className="h-px w-2 sm:w-4"
                  style={{ background: node.entry || node.current ? 'var(--accent)' : 'rgba(255,255,255,0.15)' }}
                />
              )}
              <div className="relative flex flex-col items-center" title={node.entry ? `${node.label}: ${node.entry.title}` : node.boss ? `${node.label}: Boss` : node.label}>
                <motion.div
                  className="w-3.5 h-3.5 rotate-45"
                  style={{
                    background: color ?? (node.exit ? 'transparent' : node.boss ? 'rgba(255,60,90,0.25)' : 'rgba(255,255,255,0.08)'),
                    border: node.exit ? '1px solid var(--accent)' : node.boss && !node.entry ? '1px solid #ff3c5a' : 'none',
                    boxShadow: color ? `0 0 8px ${color}` : 'none',
                  }}
                  animate={node.current && full ? { scale: [1, 1.5, 1] } : { scale: node.current ? 1.3 : 1 }}
                  transition={node.current && full ? { repeat: Infinity, duration: 1.4 } : {}}
                />
                {node.current && (
                  <motion.div
                    className="absolute top-[-3px] w-5 h-5 border rotate-45"
                    style={{ borderColor: 'var(--accent)' }}
                    animate={{ opacity: full ? [0.2, 1, 0.2] : 1 }}
                    transition={full ? { repeat: Infinity, duration: 1.4 } : {}}
                  />
                )}
                <span className={`hidden md:block mt-1.5 font-mono text-xs ${node.boss ? 'text-rose-400' : 'text-slate-400'}`}>
                  {node.boss ? '☠' : node.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
