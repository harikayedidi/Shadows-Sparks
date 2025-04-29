export const cardData = {
  darkRooms: [
    { id: 'd1', type: 'dark', title: 'Dark Corridor', description: 'Safe passage through the shadows.' },
    { id: 'd2', type: 'dark', title: 'Dim Chamber', description: 'A quiet room with no dangers.' },
    { id: 'd3', type: 'dark', title: 'Shadow Path', description: 'The darkness protects you.' },
    { id: 'd4', type: 'dark', title: 'Quiet Corner', description: 'A moment of respite.' },
    { id: 'd5', type: 'dark', title: 'Hidden Alcove', description: 'Safe from prying eyes.' }
  ].concat(Array(10).fill().map((_, i) => ({
    id: `d${i + 6}`,
    type: 'dark',
    title: 'Dark Room',
    description: 'A safe place in the darkness.'
  }))),

  lightTraps: [
    { 
      id: 'l1', 
      type: 'light', 
      title: 'Blinding Flash', 
      description: 'A sudden burst of light! Lose 2 HP.',
      hasChoice: false
    },
    { 
      id: 'l2', 
      type: 'light', 
      title: 'Light Beam', 
      description: 'Make your choice quickly!',
      hasChoice: true,
      choices: {
        skip: 'Skip the next card draw',
        damage: 'Take 1 damage instead of 2'
      }
    },
    { 
      id: 'l3', 
      type: 'light', 
      title: 'Daybreak', 
      description: 'Choose your fate!',
      hasChoice: true,
      choices: {
        skip: 'Hide until next turn',
        damage: 'Endure 1 damage'
      }
    },
    { 
      id: 'l4', 
      type: 'light', 
      title: 'Solar Flare', 
      description: 'Too bright to hide! Lose 2 HP.',
      hasChoice: false
    },
    { 
      id: 'l5', 
      type: 'light', 
      title: 'Light Burst',
      description: 'React quickly!',
      hasChoice: true,
      choices: {
        skip: 'Duck into shadows (skip next)',
        damage: 'Shield yourself (1 HP)'
      }
    }
  ],

  specialEvents: [
    { id: 's1', type: 'event', title: 'Mysterious Echo', description: 'Roll for your fate: Even - Safe, Odd - Lose 1 HP' },
    { id: 's2', type: 'event', title: 'Shadow Dance', description: 'Test your agility: Success - Gain 1 HP, Fail - Lose 1 HP' },
    { id: 's3', type: 'event', title: 'Dark Whispers', description: 'Make a choice: Draw another card or heal 1 HP' },
    { id: 's4', type: 'event', title: 'Void Portal', description: 'Skip next card or take 1 damage' },
    { id: 's5', type: 'event', title: 'Time Rift', description: 'Peek at next card or heal 1 HP' }
  ],

  items: [
    { 
      id: 'i1', 
      type: 'item', 
      title: 'Shadow Cloak', 
      description: 'Avoid next Light Trap',
      use: 'preventDamage'
    },
    { 
      id: 'i2', 
      type: 'item', 
      title: 'Health Potion', 
      description: 'Restore 2 HP',
      use: 'heal'
    },
    { 
      id: 'i3', 
      type: 'item', 
      title: 'Dark Crystal', 
      description: 'Reroll current card',
      use: 'reroll'
    },
    { 
      id: 'i4', 
      type: 'item', 
      title: 'Shadow Essence', 
      description: 'Restore 1 HP and peek next card',
      use: 'healAndPeek'
    },
    { 
      id: 'i5', 
      type: 'item', 
      title: 'Void Mirror', 
      description: 'Copy effect of last used item',
      use: 'copyItem'
    }
  ]
};

export const createDeck = () => {
  const deck = [
    ...cardData.darkRooms,
    ...cardData.lightTraps,
    ...cardData.specialEvents,
    ...cardData.items
  ];
  
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};