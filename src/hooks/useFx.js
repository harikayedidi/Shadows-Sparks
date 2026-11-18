import { useEffect, useRef, useState } from 'react';
import audio from '../utils/audio';

const vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
};

const HANDLERS = {
  deal: () => audio.blip('deal'),
  flip: (fx) => {
    audio.play('flip');
    if (fx.kind === 'trap') audio.blip('glitch');
  },
  damage: () => {
    audio.play('damage');
    audio.blip('glitch');
    vibrate([90, 40, 90]);
  },
  heal: () => {
    audio.blip('heal');
    vibrate(30);
  },
  shield: () => {
    audio.blip('shield');
    vibrate(20);
  },
  item: () => audio.play('item'),
  use: () => audio.blip('select'),
  deny: () => {
    audio.blip('deny');
    vibrate(15);
  },
  safe: () => audio.blip('safe'),
  signal: () => audio.blip('signal'),
  victory: () => audio.play('victory'),
  defeat: () => {
    audio.play('defeat');
    vibrate([200, 80, 200]);
  },
};

const VISUAL = new Set(['damage', 'heal', 'shield', 'deny', 'item']);

// Plays sound/haptics for new engine fx and returns the latest visual pulse.
export function useFx(fxList) {
  const lastId = useRef(0);
  const [pulse, setPulse] = useState(null);

  useEffect(() => {
    const fresh = fxList.filter((f) => f.id > lastId.current);
    if (!fresh.length) return;
    lastId.current = fresh[fresh.length - 1].id;
    fresh.forEach((f) => HANDLERS[f.type]?.(f));
    const visual = [...fresh].reverse().find((f) => VISUAL.has(f.type));
    if (visual) setPulse(visual);
  }, [fxList]);

  return pulse;
}
