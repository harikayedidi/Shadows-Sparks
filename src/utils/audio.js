// Sound effect URLs
const SOUND_EFFECTS = {
  cardFlip: '/sounds/card-flip.mp3',
  damage: '/sounds/damage.mp3',
  itemUse: '/sounds/item-use.mp3',
  victory: '/sounds/victory.mp3',
  defeat: '/sounds/defeat.mp3'
};

class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.muted = false;

    // Preload sounds
    Object.entries(SOUND_EFFECTS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  play(soundName) {
    if (this.muted) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      // Reset and play
      sound.currentTime = 0;
      sound.play().catch(err => {
        console.log('Audio playback failed:', err);
      });
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  setMuted(muted) {
    this.muted = muted;
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;