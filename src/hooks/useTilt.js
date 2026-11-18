import { useCallback } from 'react';
import { useSpring } from 'framer-motion';

const SPRING = { stiffness: 220, damping: 20 };

// Pointer-driven 3D tilt with a glare position exposed as --gx / --gy.
export function useTilt(max = 12) {
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);

  const onPointerMove = useCallback(
    (e) => {
      if (e.pointerType === 'touch') return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rotateY.set((px - 0.5) * 2 * max);
      rotateX.set(-(py - 0.5) * 2 * max);
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    },
    [max, rotateX, rotateY]
  );

  const onPointerLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { style: { rotateX, rotateY, transformPerspective: 900 }, onPointerMove, onPointerLeave };
}
