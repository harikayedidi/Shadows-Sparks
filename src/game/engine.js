import { BOSSES, cardData, HINTS, ITEMS, ITEM_IDS, TWISTS, TWIST_IDS, UPGRADES, UPGRADE_IDS } from '../data/cards';

export const BASE_HP = 5;
export const STANDARD_GOAL = 10;
export const INVENTORY_SLOTS = 3;
export const DOOR_COUNT = 3;
export const UPGRADE_CHOICES = 3;
const MAX_LOG = 60;
const MAX_FX = 12;
const STANDARD_BOSSES = { 4: 'watcher', 9: 'core' };
const ENDLESS_BOSSES = ['watcher', 'swarm', 'core'];

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

function shuffle(rng, arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const has = (state, upgradeId) => state.upgrades.includes(upgradeId);

export const doorCount = (state) => (has(state, 'extradoor') ? DOOR_COUNT + 1 : DOOR_COUNT);

export const floorLabel = (state, depth = state.depth) => `Floor ${depth + 1}`;

// Floors 5, 10, 15... are boss floors.
export function bossFor(state, depth = state.depth) {
  if ((depth + 1) % 5 !== 0) return null;
  if (state.mode === 'standard') return STANDARD_BOSSES[depth] ?? null;
  return ENDLESS_BOSSES[Math.floor(depth / 5) % ENDLESS_BOSSES.length];
}

function bossLocks(state, bossId) {
  const extra = state.mode === 'endless' ? Math.min(2, Math.floor(state.depth / 15)) : 0;
  return BOSSES[bossId].locks + extra;
}

function cardWeights(state) {
  if (state.boss) {
    const boss = BOSSES[state.boss.id];
    return { safe: 42, trap1: 30, trap2: boss.trapCap === 1 ? 0 : 18, choice: 0, supply: boss.noLoot ? 0 : 10 };
  }
  if (state.mode === 'endless') {
    const ramp = Math.min(state.depth, 40);
    return {
      safe: Math.max(16, 38 - ramp * 0.6),
      trap1: 22 + ramp * 0.3,
      trap2: 12 + ramp * 0.5,
      choice: 18,
      supply: 6,
    };
  }
  return { safe: 36, trap1: 24, trap2: 16, choice: 18, supply: 6 };
}

export function rollCard(rng, state) {
  const weights = cardWeights(state);
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

export function hintAccuracy(state) {
  if (state.oracle > 0) return 1;
  let accuracy = state.mode === 'endless' ? Math.max(0.45, 0.75 - state.depth * 0.012) : 0.65;
  const bossAccuracy = state.boss && BOSSES[state.boss.id].accuracy;
  if (bossAccuracy) accuracy = Math.min(accuracy, bossAccuracy);
  if (has(state, 'sharp')) accuracy = Math.min(1, accuracy + 0.15);
  return accuracy;
}

// "7 in 10" reads easier than "70%".
export const accuracyText = (state) => `${Math.round(hintAccuracy(state) * 10)} in 10`;

const SWAP = { safe: 'trap', trap: 'safe', choice: 'choice', supply: 'supply' };

function makeHint(rng, state, card) {
  if (state.twist === 'blackout') return { kind: 'unknown', line: HINTS.unknown.lines[0] };
  const truthful = rng() < hintAccuracy(state);
  let kind = card.kind;
  if (!truthful) {
    const lies = Object.keys(SWAP).filter((k) => k !== card.kind && !(k === 'safe' && has(state, 'nightvision')));
    const offered = state.boss ? lies.filter((k) => k !== 'choice') : lies;
    kind = pick(rng, offered.length ? offered : lies);
  }
  if (state.twist === 'flipped') kind = SWAP[kind];
  return { kind, line: pick(rng, HINTS[kind].lines) };
}

function makeDoors(state, rng) {
  const count = doorCount(state);
  const doors = Array.from({ length: count }, (_, i) => {
    const card = rollCard(rng, state);
    return { id: `${state.depth}-${i}-${card.uid}`, card, hint: makeHint(rng, state, card), revealed: false };
  });
  if (state.twist === 'jackpot') {
    const i = Math.floor(rng() * count);
    const card = { ...pick(rng, cardData.supply), uid: Math.floor(rng() * 1e9) };
    doors[i] = { id: `${state.depth}-${i}-${card.uid}`, card, hint: { kind: 'supply', line: 'Marked: free loot!' }, revealed: true };
  }
  return doors;
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
  const hp = Math.min(state.maxHp, state.hp + amount);
  const gained = hp - state.hp;
  if (gained <= 0) return state;
  return fx({ ...state, hp }, 'heal', { amount: gained });
}

function damage(state, amount) {
  let next = fx({ ...state, hp: Math.max(0, state.hp - amount) }, 'damage', { amount });
  if (next.hp === 0 && has(next, 'battery') && !next.batteryUsed) {
    next = log({ ...next, hp: 1, batteryUsed: true }, 'Spare Battery kicks in! You hang on with 1 health.', 'good');
  }
  return next;
}

function gainRandomItem(state, rng) {
  const item = ITEMS[pick(rng, ITEM_IDS)];
  const slot = state.inventory.indexOf(null);
  if (slot === -1) return log(state, `Your bag is full, so you leave the ${item.title} behind.`, 'warn');
  const inventory = [...state.inventory];
  inventory[slot] = item.id;
  return fx(log({ ...state, inventory }, `You got ${/^[AEIOX]/.test(item.title) ? 'an' : 'a'} ${item.title}!`, 'good'), 'item', { item: item.id });
}

function offerUpgrades(state, rng) {
  const pool = UPGRADE_IDS.filter((id) => !has(state, id));
  const offer = shuffle(rng, pool).slice(0, UPGRADE_CHOICES);
  if (!offer.length) return { ...state, phase: 'ready' };
  return fx(log({ ...state, phase: 'upgrading', offer }, 'Pick an upgrade. It lasts the whole run.', 'story'), 'offer');
}

function defeat(state) {
  const next = log(state, 'The light caught you. Game over.', 'danger');
  return fx({ ...next, phase: 'over', result: 'defeat' }, 'defeat');
}

// Clears the current floor and moves up one.
function advance(state, entry, rng, { bossBeaten = false } = {}) {
  if (state.hp <= 0) return defeat(state);
  let next = { ...state, depth: state.depth + 1, history: [...state.history, entry], twist: null, boss: null, doors: [] };
  if (next.goal && next.depth >= next.goal) {
    next = log(next, 'You reach the roof and see the real stars. You escaped!', 'good');
    return fx({ ...next, phase: 'over', result: 'victory' }, 'victory');
  }
  if (bossBeaten || next.depth % 5 === 2) return offerUpgrades(next, rng);
  return { ...next, phase: 'ready' };
}

// On a boss floor, each dark room opens one lock. Beat it to move on.
function bossProgress(state, rng) {
  const boss = BOSSES[state.boss.id];
  const left = state.boss.locks - 1;
  if (left > 0) {
    const next = log({ ...state, boss: { ...state.boss, locks: left } }, `${left} more dark ${left === 1 ? 'room' : 'rooms'} to get past ${boss.title}.`, 'good');
    return fx({ ...next, phase: 'ready' }, 'bossHit', { left });
  }
  let next = fx(log({ ...state, boss: { ...state.boss, locks: 0 } }, `You got past ${boss.title}! Heal 2.`, 'good'), 'bossDown');
  next = heal(next, 2);
  return advance(next, { kind: 'boss', title: boss.title }, rng, { bossBeaten: true });
}

export function createInitialState(mode = 'standard') {
  const base = {
    mode,
    phase: 'ready',
    hp: BASE_HP,
    maxHp: BASE_HP,
    depth: 0,
    goal: mode === 'standard' ? STANDARD_GOAL : null,
    doors: [],
    room: null,
    history: [],
    inventory: Array(INVENTORY_SLOTS).fill(null),
    upgrades: [],
    offer: [],
    twist: null,
    boss: null,
    shield: 0,
    corrupted: false,
    oracle: 0,
    darkRooms: 0,
    batteryUsed: false,
    result: null,
    log: [],
    fx: [],
    seq: 0,
  };
  const intro =
    mode === 'endless'
      ? 'Endless mode. The tower never ends. How high can you go?'
      : 'You are SPARK, a little robot. Climb 10 floors to escape the tower.';
  return log(log(base, intro, 'story'), 'Light hurts you. Dark rooms are safe. Draw your first doors!', 'info');
}

function applyChoice(state, action, rng) {
  const lucky = has(state, 'lucky');
  switch (action) {
    case 'gamble':
      return lucky || rng() < 0.5
        ? gainRandomItem(log(state, lucky ? 'Lucky Coin! It works.' : 'It works!', 'good'), rng)
        : log(damage(state, 1), 'Zap! You lose 1 health.', 'danger');
    case 'pay_for_item':
      return gainRandomItem(log(damage(state, 1), 'You trade 1 health.', 'danger'), rng);
    case 'heal_then_corrupt':
      return log({ ...heal(state, 1), corrupted: true }, 'You feel better... but your next room will be a trap.', 'warn');
    case 'heal_2':
      return log(heal(state, 2), 'Ahh. You heal 2.', 'good');
    case 'crack':
      return lucky || rng() < 0.7
        ? gainRandomItem(log(state, lucky ? 'Lucky Coin! The safe pops open.' : 'The safe pops open.', 'good'), rng)
        : log(damage(state, 1), 'The alarm goes off! You lose 1 health.', 'danger');
    case 'trade_item': {
      const slot = state.inventory.findIndex((i) => i !== null);
      if (slot === -1) return log(state, 'You have nothing to trade.', 'warn');
      const traded = ITEMS[state.inventory[slot]];
      const inventory = [...state.inventory];
      inventory[slot] = null;
      return log(heal({ ...state, inventory }, 2), `You trade your ${traded.title} and heal 2.`, 'good');
    }
    case 'oracle':
      return log({ ...state, oracle: 2 }, 'Tags will be right for the next 2 floors.', 'good');
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

  if (!canAct) return deny(`You can't use the ${item.title} right now.`);

  const consume = (s) => {
    const inventory = [...s.inventory];
    inventory[slot] = null;
    const used = fx({ ...s, inventory }, 'use', { item: itemId });
    return has(s, 'recycler') ? heal(used, 1) : used;
  };

  switch (itemId) {
    case 'nano':
      if (state.hp >= state.maxHp) return deny('Your health is already full.');
      return log(heal(consume(state), 1), 'Repair Kit used. Heal 1.', 'good');
    case 'shield': {
      const charges = has(state, 'doubleshield') ? 2 : 1;
      return log({ ...consume(state), shield: state.shield + charges }, `Shield up! It blocks the next ${charges === 2 ? '2 traps' : 'trap'}.`, 'good');
    }
    case 'scanner':
      if (state.phase !== 'choosing') return deny('Draw doors first, then use the X-Ray.');
      if (state.doors.every((d) => d.revealed)) return deny('You can already see every door.');
      return log({ ...consume(state), doors: state.doors.map((d) => ({ ...d, revealed: true })) }, 'X-Ray! Now you can see every door.', 'good');
    case 'blink':
      if (state.phase !== 'choosing') return deny('Draw doors first, then use the Reroll.');
      return fx(log({ ...consume(state), doors: makeDoors(state, rng) }, 'Reroll! Brand new doors.', 'good'), 'deal');
    case 'cloak': {
      const cloaked = log(heal(consume(state), 1), 'You put on the Shadow Cloak and sneak by.', 'good');
      if (state.boss) return bossProgress({ ...cloaked, doors: [], room: null }, rng);
      return advance({ ...cloaked, room: null }, { kind: 'cloak', title: 'Shadow Cloak' }, rng);
    }
    default:
      return state;
  }
}

function enterDoor(state, index, rng) {
  const door = state.doors[index];
  if (!door) return state;
  let card = door.card;
  let corrupted = false;
  if (state.corrupted) {
    const trap = pick(rng, cardData.traps.filter((c) => c.damage === 2));
    card = { ...trap, uid: door.card.uid, corruptedFrom: door.card.title };
    corrupted = true;
  }
  const next = { ...state, phase: 'revealing', corrupted: false, room: { card, doorIndex: index, corrupted } };
  return fx(next, 'flip', { kind: card.kind });
}

function trapDamage(state, card) {
  let amount = card.damage;
  if (has(state, 'lens') && amount >= 2) amount = 1;
  if (state.twist === 'alarm') amount += 1;
  // Endless gets meaner: traps hurt 1 more every 15 floors.
  if (state.mode === 'endless') amount += Math.floor(state.depth / 15);
  return amount;
}

export function gameReducer(state, action) {
  const rng = createRng(action.seed ?? 1);

  switch (action.type) {
    case 'START':
      return createInitialState(action.mode);

    case 'DEAL': {
      if (state.phase !== 'ready') return state;
      let next = { ...state, room: null, oracle: Math.max(0, state.oracle - 1) };
      const bossId = bossFor(state);
      if (bossId && !state.boss) {
        const boss = BOSSES[bossId];
        next = { ...next, boss: { id: bossId, locks: bossLocks(state, bossId), total: bossLocks(state, bossId) } };
        next = fx(log(next, `Boss! ${boss.intro} ${boss.text}`, 'danger'), 'boss', { boss: bossId });
      } else if (!bossId && !state.twist && state.depth > 0) {
        const chance = state.mode === 'endless' ? Math.min(0.6, 0.35 + state.depth * 0.01) : 0.4;
        if (rng() < chance) {
          const twist = TWISTS[pick(rng, TWIST_IDS)];
          next = fx(log({ ...next, twist: twist.id }, `Floor twist: ${twist.title}! ${twist.text}`, 'warn'), 'twist', { twist: twist.id });
        }
      }
      next = { ...next, doors: makeDoors(next, rng), phase: 'choosing' };
      if (!next.boss) next = log(next, `${floorLabel(state)}. Pick a door. Tags are right about ${accuracyText(state)} times.`, 'info');
      if (state.corrupted) next = log(next, 'Uh oh. The mirror curse: your next room is a trap.', 'warn');
      return fx(next, 'deal');
    }

    case 'ENTER':
      if (state.phase !== 'choosing') return state;
      return enterDoor(state, action.index, rng);

    // Countdown twist ran out: a door is picked for you.
    case 'TIMEOUT':
      if (state.phase !== 'choosing') return state;
      return enterDoor(log(state, "Too slow! A door opens on its own.", 'warn'), Math.floor(rng() * state.doors.length), rng);

    case 'RESOLVE': {
      if (state.phase !== 'revealing' || !state.room) return state;
      const { card, corrupted } = state.room;
      let next = corrupted ? log(state, `The mirror curse turns the ${card.corruptedFrom} into a ${card.title}!`, 'danger') : state;

      if (card.kind === 'choice') {
        return fx(log({ ...next, phase: 'deciding' }, `${card.title}: ${card.description}`, 'story'), 'signal');
      }
      let entryDamage = 0;
      if (card.kind === 'trap') {
        if (next.shield > 0) {
          next = fx(log({ ...next, shield: next.shield - 1 }, `Your Shield blocks the ${card.title}!`, 'good'), 'shield');
        } else {
          entryDamage = trapDamage(next, card);
          next = log(damage(next, entryDamage), `${card.title}! You lose ${entryDamage} health.`, 'danger');
        }
      } else if (card.kind === 'supply') {
        next = gainRandomItem(log(next, `${card.title}: ${card.description}`, 'story'), rng);
        if (has(next, 'scavenger')) next = gainRandomItem(log(next, 'Scavenger finds one more!', 'good'), rng);
      } else {
        next = fx(log({ ...next, darkRooms: next.darkRooms + 1 }, `${card.title}. ${card.description}`, 'story'), 'safe');
        if (has(next, 'snack') && next.darkRooms % 2 === 0) next = log(heal(next, 1), 'Shadow Snack! Heal 1.', 'good');
        if (next.twist === 'blackout') next = gainRandomItem(log(next, 'Lights Out bonus!', 'good'), rng);
      }

      if (next.boss) {
        if (next.hp <= 0) return defeat(next);
        if (card.kind === 'safe') return bossProgress(next, rng);
        return { ...next, phase: 'ready' };
      }
      return advance(next, { kind: card.kind, title: card.title, damage: entryDamage }, rng);
    }

    case 'CHOOSE': {
      if (state.phase !== 'deciding' || !state.room) return state;
      const option = state.room.card.options[action.index];
      if (!option) return state;
      if (option.requiresItem && state.inventory.every((i) => i === null)) return state;
      const next = applyChoice(state, option.action, rng);
      return advance(next, { kind: 'choice', title: state.room.card.title, picked: option.label }, rng);
    }

    case 'PICK_UPGRADE': {
      if (state.phase !== 'upgrading') return state;
      const id = state.offer[action.index];
      if (!id) return state;
      const upgrade = UPGRADES[id];
      let next = log({ ...state, upgrades: [...state.upgrades, id], offer: [], phase: 'ready' }, `New upgrade: ${upgrade.title}. ${upgrade.text}`, 'good');
      if (id === 'armor') next = heal({ ...next, maxHp: next.maxHp + 1 }, 1);
      if (id === 'bag') next = gainRandomItem({ ...next, inventory: [...next.inventory, null] }, rng);
      return fx(next, 'upgrade', { upgrade: id });
    }

    case 'USE_ITEM':
      return useItem(state, action.slot, rng);

    default:
      return state;
  }
}
