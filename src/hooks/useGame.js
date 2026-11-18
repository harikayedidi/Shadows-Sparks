import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { createInitialState, gameReducer, newSeed } from '../game/engine';

const REVEAL_MS = 950;

export function useGame(mode) {
  const [state, dispatch] = useReducer(gameReducer, mode, createInitialState);
  const act = useCallback((type, payload = {}) => dispatch({ type, ...payload, seed: newSeed() }), []);

  // Let the flip animation land before the room's effect resolves.
  useEffect(() => {
    if (state.phase !== 'revealing') return undefined;
    const timer = setTimeout(() => act('RESOLVE'), REVEAL_MS);
    return () => clearTimeout(timer);
  }, [state.phase, act]);

  const actions = useMemo(
    () => ({
      deal: () => act('DEAL'),
      enter: (index) => act('ENTER', { index }),
      choose: (index) => act('CHOOSE', { index }),
      useItem: (slot) => act('USE_ITEM', { slot }),
    }),
    [act]
  );

  return [state, actions];
}
