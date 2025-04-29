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
      description: 'A sudden burst of light! Lose 2 HP.'
    },
    { 
      id: 'l2', 
      type: 'light', 
      title: 'Light Beam', 
      description: 'Quick! Make your choice:',
      hasChoice: true,
      choices: [
        { 
          label: 'Skip next card', 
          action: 'skip',
          style: 'safe',
          subtext: 'Duck into the shadows'
        },
        { 
          label: 'Take 1 damage', 
          action: 'damage',
          style: 'danger',
          subtext: 'Instead of 2 HP'
        }
      ]
    },
    { 
      id: 'l3', 
      type: 'light', 
      title: 'Daybreak', 
      description: 'The light approaches! Choose:',
      hasChoice: true,
      choices: [
        { 
          label: 'Hide', 
          action: 'skip',
          style: 'safe',
          subtext: 'Skip your next turn'
        },
        { 
          label: 'Endure', 
          action: 'damage',
          style: 'danger',
          subtext: 'Take 1 HP damage'
        }
      ]
    },
    { 
      id: 'l4', 
      type: 'light', 
      title: 'Solar Flare', 
      description: 'Too bright to hide! Lose 2 HP.'
    },
    { 
      id: 'l5', 
      type: 'light', 
      title: 'Light Burst',
      description: 'React to the light:',
      hasChoice: true,
      choices: [
        { 
          label: 'Duck Away', 
          action: 'skip',
          style: 'safe',
          subtext: 'Skip next card draw'
        },
        { 
          label: 'Shield Yourself', 
          action: 'damage',
          style: 'danger',
          subtext: 'Take 1 HP damage'
        }
      ]
    }
  ],

  specialEvents: [
    { 
      id: 's1', 
      type: 'event', 
      title: 'Mysterious Echo', 
      description: 'A strange sound echoes...',
      hasChoice: true,
      choices: [
        {
          label: 'Listen Closely',
          action: 'roll_even',
          style: 'special',
          subtext: 'Even roll - Safe, Odd roll - Lose 1 HP'
        },
        {
          label: 'Cover Ears',
          action: 'skip',
          style: 'safe',
          subtext: 'Skip next card'
        }
      ]
    },
    { 
      id: 's2', 
      type: 'event', 
      title: 'Shadow Dance', 
      description: 'The shadows move in a pattern...',
      hasChoice: true,
      choices: [
        {
          label: 'Dance Along',
          action: 'roll_agility',
          style: 'special',
          subtext: 'Success - Gain 1 HP, Fail - Lose 1 HP'
        },
        {
          label: 'Stay Still',
          action: 'nothing',
          style: 'safe',
          subtext: 'Nothing happens'
        }
      ]
    },
    { 
      id: 's3', 
      type: 'event', 
      title: 'Dark Whispers', 
      description: 'The darkness offers a choice:',
      hasChoice: true,
      choices: [
        {
          label: 'Draw Card',
          action: 'draw',
          style: 'special',
          subtext: 'Risk another card'
        },
        {
          label: 'Heal 1 HP',
          action: 'heal',
          style: 'safe',
          subtext: 'Restore some health'
        }
      ]
    },
    { 
      id: 's4', 
      type: 'event', 
      title: 'Void Portal', 
      description: 'A dark portal appears:',
      hasChoice: true,
      choices: [
        {
          label: 'Step Through',
          action: 'skip',
          style: 'special',
          subtext: 'Skip next card'
        },
        {
          label: 'Resist Pull',
          action: 'damage',
          style: 'danger',
          subtext: 'Take 1 HP damage'
        }
      ]
    },
    { 
      id: 's5', 
      type: 'event', 
      title: 'Time Rift', 
      description: 'Time bends around you:',
      hasChoice: true,
      choices: [
        {
          label: 'Peek Ahead',
          action: 'peek',
          style: 'special',
          subtext: 'See next card'
        },
        {
          label: 'Absorb Energy',
          action: 'heal',
          style: 'safe',
          subtext: 'Heal 1 HP'
        }
      ]
    }
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