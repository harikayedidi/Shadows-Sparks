export const specialItems = [
  {
    title: 'Shadow Cloak',
    description: 'Heal 1 HP and skip your next turn.',
    use: 'heal_and_skip'
  },
  {
    title: 'Light Shield',
    description: 'Block the next light trap damage.',
    use: 'block_damage'
  }
];

export const cardData = {
  darkRooms: [
    { type: 'darkRoom', title: 'Quiet Corridor', description: 'A safe passage through the darkness.' },
    { type: 'darkRoom', title: 'Shadow Corner', description: 'A peaceful spot hidden from the light.' },
    { type: 'darkRoom', title: 'Dark Alcove', description: 'A secluded nook away from danger.' },
    { type: 'darkRoom', title: 'Dim Chamber', description: 'The darkness here feels protective.' }
  ],

  lightTraps: [
    { type: 'lightTrap', title: 'Light Beam', description: 'A piercing ray of light burns you!', damage: 1 },
    { type: 'lightTrap', title: 'Flickering Lantern', description: 'An abandoned light source reveals your position.', damage: 1 },
    { type: 'lightTrap', title: 'Moonlit Window', description: 'Pale light streams in from above.', damage: 1 }
  ],

  dangerousTraps: [
    { type: 'lightTrap', title: 'Blinding Flash', description: 'An intense burst of light sears your skin!', damage: 2 },
    { type: 'lightTrap', title: 'Pain Loop', description: 'You are jolted by a trap and lose 2 HP instantly!', damage: 2 },
    { type: 'lightTrap', title: 'Light Array', description: 'Multiple beams converge on your position!', damage: 2 }
  ],

  choiceCards: [
    {
      type: 'choice',
      title: 'Gamble Rune',
      description: 'A rune pulses with chaotic magic.',
      hasChoice: true,
      choices: [
        {
          text: 'Touch it',
          description: '50% chance: gain a Shadow Cloak OR take 1 damage.',
          action: 'random_reward_or_damage'
        },
        {
          text: 'Walk away',
          description: 'Ignore the rune and move on.',
          action: 'nothing'
        }
      ]
    },
    {
      type: 'choice',
      title: 'Wishing Flame',
      description: 'The flame offers power at a cost.',
      hasChoice: true,
      choices: [
        {
          text: 'Burn 1 HP',
          description: 'Gain a Shadow Cloak.',
          action: 'damage_reward',
          reward: 'item'
        },
        {
          text: 'Refuse',
          description: 'Leave unharmed.',
          action: 'nothing'
        }
      ]
    },
    {
      type: 'choice',
      title: 'Twisted Mirror',
      description: 'A vision of safety tempts you.',
      hasChoice: true,
      choices: [
        {
          text: 'Trust it',
          description: 'Heal 1 HP, but the next card will be a trap.',
          action: 'heal_then_corrupt',
          heal: 1
        },
        {
          text: 'Smash it',
          description: 'Avoid the risk.',
          action: 'nothing'
        }
      ]
    },
    {
      type: 'choice',
      title: 'Fountain of Echoes',
      description: 'A tranquil pool restores your strength.',
      hasChoice: true,
      choices: [
        {
          text: 'Drink the water',
          description: 'Heal 2 HP.',
          action: 'heal',
          heal: 2
        },
        {
          text: 'Walk away',
          description: "You don't trust it.",
          action: 'nothing'
        }
      ]
    },
    {
      type: 'choice',
      title: 'Sealed Scroll',
      description: 'A scroll holds forgotten knowledge.',
      hasChoice: true,
      choices: [
        {
          text: 'Read it aloud',
          description: 'Gain a Shadow Cloak.',
          action: 'reward',
          reward: 'item'
        },
        {
          text: 'Walk away',
          description: 'Better safe than sorry.',
          action: 'nothing'
        }
      ]
    }
  ]
};