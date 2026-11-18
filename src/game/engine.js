import { cardData, HINTS, ITEMS, ITEM_IDS } from '../data/cards';

export const MAX_HP = 5;
export const STANDARD_GOAL = 10;
export const INVENTORY_SLOTS = 3;
export const DOOR_COUNT = 3;
const MAX_LOG = 60;
const MAX_FX = 12;

// Actions carry a random seed so the reducer stays pure and deterministic.
export function createRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const newSeed = () => Math.floor(Math.random() * 2 ** 32);

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

function cardWeights(mode, depth) {
  if (mode === 'endless') {
    const ramp = Math.min(depth, 40);
    return {
      safe: Math.max(16, 38 - ramp * 0.6),
      trap1: 22 + ramp * 0.3,
      trap2: 12 + ramp * 0.5,
      choice: 18,
      supply: 6,
    };
  }
  return { safe: 38, trap1: 24, trap2: 14, choice: 18, supply: 6 };
}

export function rollCard(rng, mode, depth) {
  const weights = cardWeights(mode, depth);
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  let bucket = 'safe';
  for (const [key, weight] of Object.entries(weights)) {
    if (roll < weight) {
      bucket = key;
      break;
    }
    roll -= weight;
  }
  let card;
  if (bucket === 'trap1') card = pick(rng, cardData.traps.filter((c) => c.damage === 1));
  else if (bucket === 'trap2') card = pick(rng, cardData.traps.filter((c) => c.damage === 2));
  else if (bucket === 'choice') card = pick(rng, cardData.choices);
  else if (bucket === 'supply') card = pick(rng, cardData.supply);
  else card = pick(rng, cardData.safe);
  return { ...card, uid: Math.floor(rng() * 1e9) };
}

export function sensorAccuracy(state) {
  if (state.oracle > 0) return 1;
  if (state.mode === 'endless') return Math.max(0.45, 0.8 - state.depth * 0.012);
  return 0.7;
}

function makeHint(rng, card, accuracy) {
  const truthful = rng() < accuracy;
  const kind = truthful ? card.kind : pick(rng, Object.keys(HINTS).filter((k) => k !== card.kind));
  return { kind, line: pick(rng, HINTS[kind].lines) };
}

function makeDoors(state, rng) {
  const accuracy = sensorAccuracy(state);
  return Array.from({ length: DOOR_COUNT }, (_, i) => {
    const card = rollCard(rng, state.mode, state.depth);
    return { id: `${state.depth}-${i}-${card.uid}`, card, hint: makeHint(rng, card, accuracy), revealed: false };
  });
}

export function sectorLabel(state, depth = state.depth) {
  if (state.mode === 'endless') return `DEPTH ${depth + 1}`;
  return depth >= state.goal ? 'EXIT' : `B${state.goal - depth}`;
}

function log(state, text, tone = 'info') {
  const seq = state.seq + 1;
  return { ...state, seq, log: [...state.log, { id: seq, text, tone }].slice(-MAX_LOG) };
}

function fx(state, type, extra = {}) {
  const seq = state.seq + 1;
  return { ...state, seq, fx: [...state.fx, { id: seq, type, ...extra }].slice(-MAX_FX) };
}

function heal(state, amount) {
  const hp = Math.min(MAX_HP, state.hp + amount);
  const gained = hp - state.hp;
  if (gained <= 0) return state;
  return fx({ ...state, hp }, 'heal', { amount: gained });
}

function damage(state, amount) {
  const hp = Math.max(0, state.hp - amount);
  return fx({ ...state, hp }, 'damage', { amount });
}

function gainRandomItem(state, rng) {
  const item = ITEMS[pick(rng, ITEM_IDS)];
  const slot = state.inventory.indexOf(null);
  if (slot === -1) return log(state, `Inventory full. You leave the ${item.title} behind.`, 'warn');
  const inventory = [...state.inventory];
  inventory[slot] = item.id;
  return fx(log({ ...state, inventory }, `Acquired ${item.title}.`, 'good'), 'item', { item: item.id });
}

function finishRoom(state, entry) {
  let next = {
    ...state,
    depth: state.depth + 1,
    history: [...state.history, entry],
  };
  if (next.hp <= 0) {
    next = log(next, 'Core integrity lost. The light takes you.', 'danger');
    return fx({ ...next, phase: 'over', result: 'defeat' }, 'defeat');
  }
  if (next.goal && next.depth >= next.goal) {
    next = log(next, 'The surface hatch grinds open. Cool night air. You made it out.', 'good');
    return fx({ ...next, phase: 'over', result: 'victory', doors: [] }, 'victory');
  }
  return { ...next, phase: 'ready' };
}

export function createInitialState(mode = 'standard') {
  const base = {
    mode,
    phase: 'ready',
    hp: MAX_HP,
    depth: 0,
    goal: mode === 'standard' ? STANDARD_GOAL : null,
    doors: [],
    room: null,
    history: [],
    inventory: Array(INVENTORY_SLOTS).fill(null),
    shield: false,
    corrupted: false,
    oracle: 0,
    result: null,
    log: [],
    fx: [],
    seq: 0,
  };
  const intro =
    mode === 'endless'
      ? 'Endless descent engaged. The Spire has no bottom. How deep can you go?'
      : 'Boot complete. You are SPARK, sublevel B10 of the Lumen Spire. Climb to the surface.';
  return log(log(base, intro, 'story'), 'Light burns. Darkness hides. Scan the next sector to begin.', 'info');
}

function applyChoice(state, action, rng) {
  switch (action) {
    case 'gamble':
      return rng() < 0.5
        ? gainRandomItem(log(state, 'The terminal spits out a gift.', 'good'), rng)
        : log(damage(state, 1), 'Feedback surge! You take 1 damage.', 'danger');
    case 'pay_for_item':
      return gainRandomItem(log(damage(state, 1), 'You burn 1 integrity into the port.', 'danger'), rng);
    case 'heal_then_corrupt':
      return log(
        { ...heal(state, 1), corrupted: true },
        'Repaired... but your reflection follows you. The next room will be a trap.',
        'warn'
      );
    case 'heal_2':
      return log(heal(state, 2), 'Coolant floods your systems. Integrity restored.', 'good');
    case 'crack':
      return rng() < 0.7
        ? gainRandomItem(log(state, 'Encryption broken.', 'good'), rng)
        : log(damage(state, 1), 'ALARM. A floodlight snaps on: 1 damage.', 'danger');
    case 'trade_item': {
      const slot = state.inventory.findIndex((i) => i !== null);
      if (slot === -1) return log(state, 'You have nothing to trade.', 'warn');
      const traded = ITEMS[state.inventory[slot]];
      const inventory = [...state.inventory];
      inventory[slot] = null;
      return log(heal({ ...state, inventory }, 2), `Traded ${traded.title} for repairs.`, 'good');
    }
    case 'oracle':
      return log({ ...state, oracle: 2 }, 'Sensors synced. The next 2 sectors will read true.', 'good');
    default:
      return log(state, 'You move on.', 'info');
  }
}

function useItem(state, slot, rng) {
  const itemId = state.inventory[slot];
  if (!itemId) return state;
  const item = ITEMS[itemId];
  const canAct = state.phase === 'ready' || state.phase === 'choosing';
  const deny = (reason) => fx(log(state, reason, 'warn'), 'deny');

  if (!canAct) return deny(`Can't use ${item.title} right now.`);

  const consume = (s) => {
    const inventory = [...s.inventory];
    inventory[slot] = null;
    return fx({ ...s, inventory }, 'use', { item: itemId });
  };

  switch (itemId) {
    case 'nano':
      if (state.hp >= MAX_HP) return deny('Integrity already at maximum.');
      return log(heal(consume(state), 1), 'Nano Patch applied. +1 integrity.', 'good');
    case 'shield':
      if (state.shield) return deny('Light Shield is already active.');
      return log({ ...consume(state), shield: true }, 'Light Shield online. The next light trap will be absorbed.', 'good');
    case 'scanner':
      if (state.phase !== 'choosing') return deny('Scan a sector first, then pulse the doors.');
      if (state.doors.every((d) => d.revealed)) return deny('These doors are already revealed.');
      return log(
        { ...consume(state), doors: state.doors.map((d) => ({ ...d, revealed: true })) },
        'Scanner Pulse! Every door lays bare.',
        'good'
      );
    case 'blink':
      if (state.phase !== 'choosing') return deny('Nothing to phase past yet. Scan a sector first.');
      return log({ ...consume(state), doors: makeDoors(state, rng) }, 'Blink Drive: reality shifts. New doors.', 'good');
    case 'cloak': {
      const cloaked = log(heal(consume(state), 1), `You melt into the shadows and slip past ${sectorLabel(state)}.`, 'good');
      return finishRoom({ ...cloaked, doors: [], room: null }, { kind: 'cloak', title: 'Shadow Cloak' });
    }
    default:
      return state;
  }
}

export function gameReducer(state, action) {
  const rng = createRng(action.seed ?? 1);

  switch (action.type) {
    case 'START':
      return createInitialState(action.mode);

    case 'DEAL': {
      if (state.phase !== 'ready') return state;
      const doors = makeDoors(state, rng);
      const accuracy = Math.round(sensorAccuracy(state) * 100);
      let next = { ...state, doors, room: null, phase: 'choosing', oracle: Math.max(0, state.oracle - 1) };
      next = log(next, `${sectorLabel(state)}: ${DOOR_COUNT} doors detected. Sensor integrity ${accuracy}%.`, 'info');
      if (state.corrupted) next = log(next, 'Something is wrong. Every door flickers with your reflection.', 'warn');
      return fx(next, 'deal');
    }

    case 'ENTER': {
      if (state.phase !== 'choosing') return state;
      const door = state.doors[action.index];
      if (!door) return state;
      let card = door.card;
      let corrupted = false;
      if (state.corrupted) {
        const trap = pick(rng, cardData.traps.filter((c) => c.damage === 2));
        card = { ...trap, uid: door.card.uid, corruptedFrom: door.card.title };
        corrupted = true;
      }
      const next = { ...state, phase: 'revealing', corrupted: false, room: { card, doorIndex: action.index, corrupted } };
      return fx(next, 'flip', { kind: card.kind });
    }

    case 'RESOLVE': {
      if (state.phase !== 'revealing' || !state.room) return state;
      const { card, corrupted } = state.room;
      let next = corrupted ? log(state, `The ${card.corruptedFrom} warps into a ${card.title}!`, 'danger') : state;

      if (card.kind === 'choice') {
        return fx(log({ ...next, phase: 'deciding' }, `${card.title}: ${card.description}`, 'story'), 'signal');
      }
      if (card.kind === 'trap') {
        if (next.shield) {
          next = fx(log({ ...next, shield: false }, `Light Shield absorbs the ${card.title}!`, 'good'), 'shield');
        } else {
          next = log(damage(next, card.damage), `${card.title}: ${card.damage} damage.`, 'danger');
        }
      } else if (card.kind === 'supply') {
        next = gainRandomItem(log(next, `${card.title}: ${card.description}`, 'story'), rng);
      } else {
        next = fx(log(next, `${card.title}: ${card.description}`, 'story'), 'safe');
      }
      return finishRoom(next, { kind: card.kind, title: card.title, damage: card.damage ?? 0 });
    }

    case 'CHOOSE': {
      if (state.phase !== 'deciding' || !state.room) return state;
      const option = state.room.card.options[action.index];
      if (!option) return state;
      if (option.requiresItem && state.inventory.every((i) => i === null)) return state;
      const next = applyChoice(state, option.action, rng);
      return finishRoom(next, { kind: 'choice', title: state.room.card.title, picked: option.label });
    }

    case 'USE_ITEM':
      return useItem(state, action.slot, rng);

    default:
      return state;
  }
}
