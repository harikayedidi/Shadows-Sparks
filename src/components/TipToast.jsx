import { AnimatePresence, motion } from 'framer-motion';

// Small, non-blocking beginner tip.
export default function TipToast({ tip, onDismiss }) {
  return (
    <div className="fixed inset-x-0 bottom-3 z-[65] flex justify-center px-3 pointer-events-none">
      <AnimatePresence>
        {tip && (
          <motion.div
            key={tip.id}
            className="panel pointer-events-auto w-full max-w-md px-4 py-3 flex items-start gap-3"
            style={{ border: '1px solid var(--accent)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            role="status"
          >
            <span className="text-xl leading-none" style={{ color: 'var(--accent)' }} aria-hidden="true">💡</span>
            <p className="flex-1 text-sm sm:text-base text-slate-100 leading-snug">{tip.text}</p>
            <button className="hud-label !text-xs underline shrink-0" onClick={onDismiss}>Got it</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
