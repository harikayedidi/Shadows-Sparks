// You are SPARK, a little robot escaping a tower full of lights.
// Light hurts you. Darkness keeps you safe.

export const ITEMS = {
  cloak: {
    id: 'cloak',
    title: 'Shadow Cloak',
    glyph: '◐',
    description: 'Heal 1 and skip this floor.',
  },
  shield: {
    id: 'shield',
    title: 'Shield',
    glyph: '⬡',
    description: 'Blocks the next bright trap.',
  },
  scanner: {
    id: 'scanner',
    title: 'X-Ray',
    glyph: '◎',
    description: 'Shows what is behind every door.',
  },
  nano: {
    id: 'nano',
    title: 'Repair Kit',
    glyph: '✚',
    description: 'Heal 1.',
  },
  blink: {
    id: 'blink',
    title: 'Reroll',
    glyph: '⟲',
    description: 'Swap the doors for new ones.',
  },
};

export const ITEM_IDS = Object.keys(ITEMS);

// Upgrades last the whole run. Several are meant to combo with each other.
export const UPGRADES = {
  nightvision: { id: 'nightvision', title: 'Night Vision', glyph: '☾', text: 'DARK tags are never wrong.' },
  sharp: { id: 'sharp', title: 'Sharp Eyes', glyph: '◉', text: 'All tags are right more often.' },
  snack: { id: 'snack', title: 'Shadow Snack', glyph: '◒', text: 'Every 2nd dark room heals 1.' },
  armor: { id: 'armor', title: 'Thick Armor', glyph: '⬢', text: '+1 max health, and heal 1.' },
  lens: { id: 'lens', title: 'Sunglasses', glyph: '◑', text: 'Big traps hurt 1 instead of 2.' },
  bag: { id: 'bag', title: 'Bigger Bag', glyph: '▦', text: '+1 item slot, and a free item.' },
  lucky: { id: 'lucky', title: 'Lucky Coin', glyph: '✪', text: 'Risky events always go your way.' },
  scavenger: { id: 'scavenger', title: 'Scavenger', glyph: '✧', text: 'Loot rooms give 2 items.' },
  recycler: { id: 'recycler', title: 'Recycler', glyph: '♻', text: 'Using an item also heals 1.' },
  extradoor: { id: 'extradoor', title: 'Extra Door', glyph: '▥', text: 'See 4 doors on every floor.' },
  battery: { id: 'battery', title: 'Spare Battery', glyph: '⚡', text: 'Once per run, survive a knockout with 1 health.' },
  doubleshield: { id: 'doubleshield', title: 'Double Shield', glyph: '⛉', text: 'Shields block 2 traps instead of 1.' },
};

export const UPGRADE_IDS = Object.keys(UPGRADES);

// Special rules that can show up on normal floors.
export const TWISTS = {
  blackout: { id: 'blackout', title: 'Lights Out', glyph: '●', text: 'No tags on this floor. Dark rooms give a free item.' },
  alarm: { id: 'alarm', title: 'Alarm', glyph: '⚠', text: 'Bright traps hurt 1 more on this floor.' },
  countdown: { id: 'countdown', title: 'Hurry!', glyph: '⏱', text: 'Pick a door in 8 seconds, or one gets picked for you.', seconds: 8 },
  flipped: { id: 'flipped', title: 'Upside Down', glyph: '⇅', text: 'DARK and BRIGHT tags are swapped on this floor.' },
  jackpot: { id: 'jackpot', title: 'Lucky Floor', glyph: '★', text: 'One door has free loot, and it is marked.' },
};

export const TWIST_IDS = Object.keys(TWISTS);

// Boss floors: find enough dark rooms to sneak past. You stay on the floor until you do.
export const BOSSES = {
  watcher: {
    id: 'watcher',
    title: 'The Watcher',
    glyph: '◉',
    intro: 'A giant eye guards this floor.',
    text: 'Find 3 dark rooms to sneak past it. Its traps only hurt 1.',
    locks: 3,
    trapCap: 1,
  },
  swarm: {
    id: 'swarm',
    title: 'Drone Swarm',
    glyph: '⋇',
    intro: 'A cloud of drones fills the hall.',
    text: 'Find 4 dark rooms to slip through. No loot here.',
    locks: 4,
    noLoot: true,
  },
  core: {
    id: 'core',
    title: 'The Light Core',
    glyph: '✹',
    intro: 'The heart of the tower. It is blinding.',
    text: 'Find 3 dark rooms to escape. Tags are only right half the time.',
    locks: 3,
    accuracy: 0.5,
  },
};

export const cardData = {
  safe: [
    { kind: 'safe', title: 'Dark Hallway', description: 'Safe. Nothing can see you here.', flavor: 'The lights are broken. You tiptoe through.' },
    { kind: 'safe', title: 'Old Server Room', description: 'Safe. Everything is switched off.', flavor: 'Rows of sleeping computers. Not one notices you.' },
    { kind: 'safe', title: 'Air Vent', description: 'Safe. A tight squeeze, but dark.', flavor: 'You crawl through. A drone flies right past.' },
    { kind: 'safe', title: 'Frozen Tunnel', description: 'Safe. The cameras froze long ago.', flavor: 'Frost covers every lens. You walk by unseen.' },
    { kind: 'safe', title: 'Empty Garage', description: 'Safe. Just sleeping machines.', flavor: 'Big robots hang from the ceiling, eyes dark.' },
  ],

  traps: [
    { kind: 'trap', title: 'Searchlight', description: 'Bright light! Lose 1 health.', flavor: 'A beam sweeps the room and finds you.', damage: 1 },
    { kind: 'trap', title: 'Flash Drone', description: 'Bright light! Lose 1 health.', flavor: 'A little drone drops down and flashes you.', damage: 1 },
    { kind: 'trap', title: 'Neon Sign', description: 'Bright light! Lose 1 health.', flavor: '"SHOP NOW!" A huge sign blinks on in your face.', damage: 1 },
    { kind: 'trap', title: 'Laser Grid', description: 'Very bright! Lose 2 health.', flavor: 'Red lasers fill the room. No way around them.', damage: 2 },
    { kind: 'trap', title: 'Flash Mine', description: 'Very bright! Lose 2 health.', flavor: 'Click. The floor explodes into light.', damage: 2 },
    { kind: 'trap', title: 'Guard Tower', description: 'Very bright! Lose 2 health.', flavor: 'A giant spotlight locks onto you.', damage: 2 },
  ],

  supply: [
    { kind: 'supply', title: 'Supply Box', description: 'Loot! You get a free item.', flavor: 'A forgotten box. Something useful inside.' },
    { kind: 'supply', title: 'Crashed Drone', description: 'Loot! You get a free item.', flavor: 'It was carrying a package. Now it is yours.' },
  ],

  choices: [
    {
      kind: 'choice',
      title: 'Glitchy Computer',
      description: 'A broken computer blinks at you.',
      flavor: 'Text scrolls too fast to read. A plug is flashing.',
      options: [
        { label: 'Plug in', hint: 'Coin flip: get an item, or lose 1 health.', action: 'gamble' },
        { label: 'Walk away', hint: 'Nothing happens.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Power Trade',
      description: 'Trade some health for an item.',
      flavor: 'A machine hums. It wants a bit of your power.',
      options: [
        { label: 'Trade', hint: 'Lose 1 health, get an item.', action: 'pay_for_item' },
        { label: 'No thanks', hint: 'Nothing happens.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Strange Mirror',
      description: 'Your reflection offers to fix you.',
      flavor: 'It looks just like you, but its smile is too wide.',
      options: [
        { label: 'Accept', hint: 'Heal 1, but your next room will be a trap.', action: 'heal_then_corrupt' },
        { label: 'Smash it', hint: 'Nothing happens.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Cool Spring',
      description: 'Fresh coolant bubbles up from a pipe.',
      flavor: 'It shimmers blue. Your systems would love it.',
      options: [
        { label: 'Drink', hint: 'Heal 2.', action: 'heal_2' },
        { label: 'Skip it', hint: 'Nothing happens.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Locked Safe',
      description: 'A safe with an alarm on it.',
      flavor: 'You could probably open it. Probably.',
      options: [
        { label: 'Open it', hint: '7 in 10: get an item. Otherwise lose 1 health.', action: 'crack' },
        { label: 'Leave it', hint: 'Nothing happens.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Robot Trader',
      description: 'A friendly robot swaps repairs for items.',
      flavor: '"Parts for parts, friend!" it beeps.',
      options: [
        { label: 'Trade an item', hint: 'Give your first item, heal 2.', action: 'trade_item', requiresItem: true },
        { label: 'No thanks', hint: 'Keep your stuff.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Wise Old Robot',
      description: 'An old robot offers to help you see.',
      flavor: '"I know every door in this tower," it whispers.',
      options: [
        { label: 'Listen', hint: 'Tags are always right for the next 2 floors.', action: 'oracle' },
        { label: 'Ignore it', hint: 'Nothing happens.', action: 'nothing' },
      ],
    },
  ],
};

// Door tags. A tag can be wrong, depending on how good your hints are.
export const HINTS = {
  safe: { label: 'DARK', lines: ['Quiet and dark.', 'No sound inside.', 'Cold, still air.', 'Pitch black.'] },
  trap: { label: 'BRIGHT', lines: ['Light under the door.', 'Something is humming.', 'It feels warm.', 'A lens is whirring.'] },
  choice: { label: 'EVENT', lines: ['Something strange inside.', 'You hear a voice.', 'A screen is flickering.'] },
  supply: { label: 'LOOT', lines: ['Boxes rattle inside.', 'A beacon is blinking.', 'Smells like fresh oil.'] },
  unknown: { label: '???', lines: ['Too dark to tell.'] },
};
