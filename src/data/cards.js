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
      title: 'Cursed Chest',
      description: 'A mysterious chest radiates dark energy.',
      hasChoice: true,
      choices: [
        { text: 'Open the chest', description: 'Risk damage to gain a special item', action: 'damage', reward: 'item' },
        { text: 'Leave it alone', description: 'Better safe than sorry', action: 'nothing' }
      ]
    },
    {
      type: 'choice',
      title: 'Dark Bargain',
      description: 'A shadowy figure offers a deal.',
      hasChoice: true,
      choices: [
        {
          text: 'Accept the deal',
          description: 'Discard an item to heal 1 HP',
          action: 'discard_item',
          reward: 'heal',
          requiresInventory: true
        },
        {
          text: 'Refuse',
          description: 'Take 1 damage instead',
          action: 'damage'
        }
      ]
    },
    {
      type: 'choice',
      title: 'Fork in the Path',
      description: 'Two paths lie ahead, which do you choose?',
      hasChoice: true,
      choices: [
        { text: 'Dark Path', description: 'Draw another card', action: 'draw' },
        { text: 'Light Path', description: 'Heal 1 HP', action: 'heal' }
      ]
    }
  ]
};