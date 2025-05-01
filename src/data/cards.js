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
    { type: 'trap', title: 'Corrupted Mirror', description: 'Dark energy twists the next cards with malevolent power.', effect: 'corrupt_next_2' },
    { type: 'trap', title: 'Chain Reaction', description: 'The trap forces you forward into danger!', effect: 'lose_hp_draw_2', damage: 1 },
    { type: 'lightTrap', title: 'Light Array', description: 'Multiple beams converge on your position!', damage: 2 }
  ],

  specialCards: [
    { type: 'special', title: 'Shadow Cloak', description: 'Lets you skip your next turn.', use: 'skip' },
    { type: 'special', title: 'Crystal Eye', description: 'Reveals the next card in the deck.', use: 'peek' }
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
          description: '50% chance: gain a special item OR take 1 damage.',
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
          description: 'Gain 1 special item.',
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
          action: 'heal_then_corrupt'
        },
        {
          text: 'Smash it',
          description: 'Avoid the risk.',
          action: 'nothing'
        }
      ]
    }
  ]
};