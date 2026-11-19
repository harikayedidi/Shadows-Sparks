import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ITEMS } from '../data/cards';
import { useMobile } from '../hooks/useMobile';

const KEYS = ['Q', 'W', 'E', 'R'];

const isOver = (targetRef, point) => {
  const rect = targetRef.current?.getBoundingClientRect();
  if (!rect) return false;
  const x = point.x - window.scrollX;
  const y = point.y - window.scrollY;
  return x >= rect.left - 12 && x <= rect.right + 12 && y >= rect.top - 12 && y <= rect.bottom + 12;
};

function ItemSlot({ itemId, slot, mobile, selected, dropTargetRef, onUse, onTap, onDragState }) {
  const dragged = useRef(false);
  const item = ITEMS[itemId];

  return (
    <div className="relative w-[4.75rem] h-[4.75rem] sm:w-20 sm:h-20">
      <div className="absolute inset-0 border border-dashed border-white/15 grid place-items-center">
        <kbd>{KEYS[slot]}</kbd>
      </div>
      <AnimatePresence>
        {item && (
          <motion.button
            key={itemId + slot}
            className="group absolute inset-0 flex flex-col items-center justify-center bg-black/60"
            style={{
              border: '1px solid var(--accent)',
              boxShadow: selected
                ? '0 0 0 2px var(--accent), 0 0 22px var(--accent), inset 0 0 16px var(--accent-soft)'
                : '0 0 18px var(--accent-soft), inset 0 0 16px var(--accent-soft)',
              touchAction: 'none',
              zIndex: 5,
            }}
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0, transition: { duration: 0.3 } }}
            drag
            dragSnapToOrigin
            dragElastic={0.9}
            whileHover={mobile ? undefined : { scale: 1.08 }}
            whileDrag={{ scale: 1.2, zIndex: 80 }}
            onDragStart={() => {
              dragged.current = true;
              onDragState('drag');
            }}
            onDrag={(_, info) => onDragState(isOver(dropTargetRef, info.point) ? 'over' : 'drag')}
            onDragEnd={(_, info) => {
              onDragState(null);
              setTimeout(() => {
                dragged.current = false;
              }, 60);
              if (isOver(dropTargetRef, info.point)) onUse(slot);
            }}
            onClick={() => {
              if (dragged.current) return;
              if (mobile) onTap(slot);
              else onUse(slot);
            }}
            aria-label={mobile ? `${item.title}: ${item.description} Double-tap to use.` : `Use ${item.title} (${KEYS[slot]}): ${item.description}`}
            aria-pressed={mobile ? selected : undefined}
          >
            <span className="text-3xl leading-none" style={{ color: 'var(--accent)', textShadow: '0 0 10px var(--accent)' }}>
              {item.glyph}
            </span>
            <span className="mt-1 font-mono text-xs text-slate-200 uppercase text-center leading-tight px-0.5">
              {item.title}
            </span>
            {!mobile && (
              <span className="pointer-events-none absolute bottom-full mb-2 left-0 w-56 p-2 text-sm text-left bg-black/90 border border-white/10 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <b className="block text-white">{item.title} <kbd>{KEYS[slot]}</kbd></b>
                {item.description}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

const DOUBLE_TAP_MS = 400;

export default function Inventory({ items, dropTargetRef, onUse, onDragState, onInspect }) {
  const mobile = useMobile();
  const [selected, setSelected] = useState(null);
  const lastTap = useRef({ slot: null, at: 0 });
  const infoRef = useRef(null);
  const info = selected != null ? ITEMS[items[selected]] : null;

  useEffect(() => {
    if (selected != null && !items[selected]) setSelected(null);
  }, [items, selected]);

  useEffect(() => {
    if (!info) return undefined;
    const timer = setTimeout(() => infoRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 200);
    return () => clearTimeout(timer);
  }, [info]);

  // Phones: one tap shows what an item does, a quick second tap uses it.
  const tap = (slot) => {
    const now = Date.now();
    const prev = lastTap.current;
    if (prev.slot === slot && now - prev.at < DOUBLE_TAP_MS) {
      lastTap.current = { slot: null, at: 0 };
      setSelected(null);
      onUse(slot);
      return;
    }
    lastTap.current = { slot, at: now };
    setSelected(slot);
    onInspect?.();
  };

  return (
    <section className="panel panel-open px-3 py-2 sm:px-4 sm:py-3" aria-label="Items">
      <p className="hud-label mb-2">{mobile ? (
          <>Items · <span className="whitespace-nowrap">tap to see,</span> <span className="whitespace-nowrap">double-tap to use</span></>
        ) : (
          'Items · tap or drag onto health'
        )}</p>
      <div className="flex gap-2 sm:gap-3">
        {items.map((itemId, slot) => (
          <ItemSlot
            key={slot}
            itemId={itemId}
            slot={slot}
            mobile={mobile}
            selected={selected === slot}
            dropTargetRef={dropTargetRef}
            onUse={onUse}
            onTap={tap}
            onDragState={onDragState}
          />
        ))}
      </div>
      {/* Below the slots so it never shifts the item you're about to tap again. */}
      {mobile && info && (
        <div ref={infoRef} className="mt-3 p-3 bg-black/70 flex items-start gap-3" style={{ border: '1px solid var(--accent)' }} role="status">
          <span className="text-2xl leading-none" style={{ color: 'var(--accent)' }} aria-hidden="true">{info.glyph}</span>
          <div className="flex-1 min-w-0">
            <b className="block text-white">{info.title}</b>
            <p className="text-sm text-slate-200">{info.description}</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--accent)' }}>Double-tap to use it, or drag it onto your health.</p>
          </div>
          <button className="icon-btn shrink-0" onClick={() => setSelected(null)} aria-label="Close item info">✕</button>
        </div>
      )}
    </section>
  );
}
