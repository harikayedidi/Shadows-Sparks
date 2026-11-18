import { motion } from 'framer-motion';
import { KIND_STYLE } from '../data/themes';

const nodeColor = (entry) => {
  if (!entry) return null;
  if (entry.kind === 'cloak') return 'var(--accent)';
  return KIND_STYLE[entry.kind]?.color ?? '#888';
};

// The climb so far: each visited sector is colored by what you found there.
export default function DepthMap({ mode, goal, depth, history }) {
  const nodes =
    mode === 'endless'
      ? Array.from({ length: 10 }, (_, i) => Math.max(0, depth - 7) + i).map((d) => ({
          key: d,
          label: `D${d + 1}`,
          entry: history[d],
          current: d === depth,
          exit: false,
        }))
      : [
          ...Array.from({ length: goal }, (_, d) => ({
            key: d,
            label: `B${goal - d}`,
            entry: history[d],
            current: d === depth,
            exit: false,
          })),
          { key: 'exit', label: 'EXIT', entry: null, current: depth >= goal, exit: true },
        ];

  return (
    <div className="flex flex-col gap-1 min-w-0" aria-label={`Progress: sector ${depth + 1}${goal ? ` of ${goal}` : ''}`}>
      <span className="hud-label">{mode === 'endless' ? `Depth ${depth}` : `Ascent ${depth}/${goal}`}</span>
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
              <div className="relative flex flex-col items-center" title={node.entry ? `${node.label}: ${node.entry.title}` : node.label}>
                <motion.div
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rotate-45"
                  style={{
                    background: color ?? (node.exit ? 'transparent' : 'rgba(255,255,255,0.08)'),
                    border: node.exit ? '1px solid var(--accent)' : 'none',
                    boxShadow: color ? `0 0 8px ${color}` : 'none',
                  }}
                  animate={node.current ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                  transition={node.current ? { repeat: Infinity, duration: 1.4 } : {}}
                />
                {node.current && (
                  <motion.div
                    className="absolute top-[-3px] w-[18px] h-[18px] sm:w-5 sm:h-5 border rotate-45"
                    style={{ borderColor: 'var(--accent)' }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                  />
                )}
                <span className="hidden md:block mt-1.5 font-mono text-[9px] tracking-wider text-slate-500">{node.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
