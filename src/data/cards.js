// Setting: you are SPARK, a rogue android climbing out of the Lumen Spire.
// Light sensors burn you. Darkness hides you.

export const ITEMS = {
  cloak: {
    id: 'cloak',
    title: 'Shadow Cloak',
    glyph: '◐',
    description: 'Restore 1 integrity and slip past this sector unseen.',
  },
  shield: {
    id: 'shield',
    title: 'Light Shield',
    glyph: '⬡',
    description: 'Absorb the next light trap completely.',
  },
  scanner: {
    id: 'scanner',
    title: 'Scanner Pulse',
    glyph: '◎',
    description: 'Reveal exactly what waits behind every open door.',
  },
  nano: {
    id: 'nano',
    title: 'Nano Patch',
    glyph: '✚',
    description: 'Restore 1 integrity immediately.',
  },
  blink: {
    id: 'blink',
    title: 'Blink Drive',
    glyph: '⟲',
    description: 'Phase-shift: reroll the doors in front of you.',
  },
};

export const ITEM_IDS = Object.keys(ITEMS);

export const cardData = {
  safe: [
    {
      kind: 'safe',
      title: 'Blackout Corridor',
      description: 'Every panel here is dead. Safe passage.',
      flavor: 'Emergency strips flicker out one by one. In the dark, your servos finally go quiet.',
    },
    {
      kind: 'safe',
      title: 'Dead Server Bay',
      description: 'Cold racks, zero power draw. Nothing sees you.',
      flavor: 'Rows of silent servers hold memories nobody will read again. You walk between them like a ghost.',
    },
    {
      kind: 'safe',
      title: 'Maintenance Duct',
      description: 'A cramped shaft far from the sensor grid.',
      flavor: 'You fold yourself into the duct. Somewhere above, a drone passes without noticing.',
    },
    {
      kind: 'safe',
      title: 'Coolant Tunnel',
      description: 'Frost and shadow. The cameras froze long ago.',
      flavor: 'Frozen vapor curls around your ankles. The lenses on the walls are crusted white and blind.',
    },
    {
      kind: 'safe',
      title: 'Powered-Down Hangar',
      description: 'A cavern of sleeping machines.',
      flavor: 'Mech frames hang from chains like sleeping bats. Their eyes stay dark as you pass.',
    },
  ],

  traps: [
    {
      kind: 'trap',
      title: 'Scanner Sweep',
      description: 'A lumen beam sweeps the room and finds you.',
      flavor: 'A blue line slides across the floor, up your chassis, and stops. Your plating hisses.',
      damage: 1,
    },
    {
      kind: 'trap',
      title: 'Flicker Drone',
      description: 'A patrol drone pins you in its spotlight.',
      flavor: 'It drops from the ceiling with a whine and blooms white-hot light right into your optics.',
      damage: 1,
    },
    {
      kind: 'trap',
      title: 'Holo Billboard',
      description: 'An ad screen wakes up and floods the hall.',
      flavor: '"ASCEND WITH LUMEN!" The hologram roars to life and bathes you in searing neon.',
      damage: 1,
    },
    {
      kind: 'trap',
      title: 'Laser Grid',
      description: 'Converging lasers slice through the dark.',
      flavor: 'A lattice of red light snaps into existence. There is no angle that keeps you whole.',
      damage: 2,
    },
    {
      kind: 'trap',
      title: 'Photon Burst',
      description: 'A flashbang mine detonates in pure light.',
      flavor: 'Click. A silent sun opens beneath your feet and every sensor you own screams.',
      damage: 2,
    },
    {
      kind: 'trap',
      title: 'Sentinel Spotlight',
      description: 'A tower sentinel locks on from above.',
      flavor: 'The sentinel turns its great eye toward you. The beam is heavy, like being pressed into the floor.',
      damage: 2,
    },
  ],

  supply: [
    {
      kind: 'supply',
      title: 'Supply Cache',
      description: 'A forgotten crate of salvage. Grab something useful.',
      flavor: 'The crate seal pops with a sigh. Inside, wrapped in static foil, is exactly what you need.',
    },
    {
      kind: 'supply',
      title: 'Courier Wreck',
      description: 'A downed delivery drone, cargo intact.',
      flavor: 'Its rotors twitch weakly. You pry open the hold and take what it was carrying.',
    },
  ],

  choices: [
    {
      kind: 'choice',
      title: 'Glitched Terminal',
      description: 'A terminal stutters with unstable code.',
      flavor: 'Text scrolls too fast to read. A jack port pulses, inviting you in.',
      options: [
        { label: 'Jack in', hint: '50%: gain an item, or take 1 damage.', action: 'gamble' },
        { label: 'Walk away', hint: 'Leave it blinking.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Overclock Port',
      description: 'Burn your own core to forge something new.',
      flavor: 'The port hums at a frequency you can feel in your teeth. Power always has a price.',
      options: [
        { label: 'Burn 1 integrity', hint: 'Take 1 damage, gain an item.', action: 'pay_for_item' },
        { label: 'Refuse', hint: 'Keep your core intact.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Mirror Protocol',
      description: 'A reflection of you offers a repair, at a cost.',
      flavor: 'In the glass stands a perfect, undamaged version of you. It smiles too wide.',
      options: [
        { label: 'Trust it', hint: 'Restore 1 integrity, but your next room becomes a trap.', action: 'heal_then_corrupt' },
        { label: 'Shatter it', hint: 'Avoid the risk.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Coolant Spring',
      description: 'Clean coolant bubbles from a cracked pipe.',
      flavor: 'It shimmers blue-black, almost alive. Your temperature warnings blink hopefully.',
      options: [
        { label: 'Recalibrate', hint: 'Restore 2 integrity.', action: 'heal_2' },
        { label: "Don't trust it", hint: 'Move on.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Encrypted Cache',
      description: 'A locked vault, alarm wired to the lid.',
      flavor: 'Three layers of encryption. Your decryptor whirs. You could probably crack it. Probably.',
      options: [
        { label: 'Crack it', hint: '70%: gain an item. 30%: alarm, 1 damage.', action: 'crack' },
        { label: 'Leave it', hint: 'Better safe than scorched.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Black Market Drone',
      description: 'A smuggler drone trades repairs for gear.',
      flavor: '"Parts for parts, friend," it chirps, extending a claw. "Fair is fair."',
      options: [
        { label: 'Trade an item', hint: 'Give up your first item, restore 2 integrity.', action: 'trade_item', requiresItem: true },
        { label: 'Decline', hint: 'Keep your gear.', action: 'nothing' },
      ],
    },
    {
      kind: 'choice',
      title: 'Oracle Node',
      description: 'An old AI offers to sharpen your sensors.',
      flavor: '"I see every door in this tower," it whispers. "Let me show you which ones lie."',
      options: [
        { label: 'Sync with it', hint: 'Sensors read perfectly for the next 2 sectors.', action: 'oracle' },
        { label: 'Ignore it', hint: 'Trust your own instruments.', action: 'nothing' },
      ],
    },
  ],
};

// What the door sensors "hear". A hint may lie depending on sensor integrity.
export const HINTS = {
  safe: {
    label: 'COLD',
    lines: [
      'Cold, still air.',
      'No power signature.',
      'Total silence behind the seal.',
      'Frost on the door frame.',
    ],
  },
  trap: {
    label: 'LUMEN',
    lines: [
      'A faint hum of capacitors.',
      'Warm air bleeds under the door.',
      'A lens whirs. Something is watching.',
      'Light leaks through the seams.',
    ],
  },
  choice: {
    label: 'SIGNAL',
    lines: [
      'A strange signal pulses.',
      'Someone left a process running.',
      'Static that sounds almost like a voice.',
    ],
  },
  supply: {
    label: 'CACHE',
    lines: [
      'Metal crates shift.',
      'A supply beacon blinks.',
      'The scent of fresh lubricant.',
    ],
  },
};
