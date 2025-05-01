class AudioManager {
  constructor() {
    this.soundEffects = {
      cardFlip: new Audio('/sounds/card-flip.mp3'),
      damage: new Audio('/sounds/damage.mp3'),
      itemUse: new Audio('/sounds/item-use.mp3'),
      victory: new Audio('/sounds/victory.mp3'),
      defeat: new Audio('/sounds/defeat.mp3')
    };

    // Configure all audio elements
    Object.values(this.soundEffects).forEach(audio => {
      audio.preload = 'auto';
      audio.volume = 0.5;
    });

    this.isMuted = false;
    this.playCount = {};
    this.maxPlays = {
      damage: 2, // Limit damage sound to 2 plays
      defeat: 1, // Play defeat sound only once
      victory: 1  // Play victory sound only once
    };
  }

  play(soundName) {
    if (this.isMuted || !this.soundEffects[soundName]) return;

    // Initialize play count if not exists
    if (!this.playCount[soundName]) {
      this.playCount[soundName] = 0;
    }

    // Check if we've reached the maximum plays for this sound
    const maxPlays = this.maxPlays[soundName] || Infinity;
    if (this.playCount[soundName] >= maxPlays) {
      return;
    }

    try {
      const sound = this.soundEffects[soundName];
      
      // Stop and reset if already playing
      sound.pause();
      sound.currentTime = 0;

      // Increment play count
      this.playCount[soundName]++;

      // Play the sound with a small delay to prevent overlapping
      setTimeout(() => {
        const playPromise = sound.play();
        
        if (playPromise) {
          playPromise.catch(error => {
            console.warn('Audio playback failed:', error);
          });
        }
      }, 50);
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  // Reset play counts
  resetPlayCounts() {
    this.playCount = {};
  }

  setMuted(muted) {
    this.isMuted = muted;
    
    // Stop all sounds when muting
    if (muted) {
      Object.values(this.soundEffects).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
    // Reset play counts when unmuting
    if (!muted) {
      this.resetPlayCounts();
    }
  }

  // Preload all sounds
  preloadAll() {
    return Promise.all(
      Object.values(this.soundEffects).map(audio => {
        return new Promise((resolve) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.load();
        });
      })
    ).catch(error => {
      console.warn('Error preloading sounds:', error);
    });
  }
}

// Create singleton instance
const audioManager = new AudioManager();

// Start preloading
audioManager.preloadAll();

export default audioManager;