// Audio system using Web Audio API for synthesized sounds

class AudioSystem {
  private audioContext: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private musicOscillator: OscillatorNode | null = null;
  private musicVolume = 0.3;
  private sfxVolume = 0.5;
  private isMusicPlaying = false;

  initialize() {
    if (typeof window === 'undefined') return;
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.musicGainNode = this.audioContext.createGain();
      this.sfxGainNode = this.audioContext.createGain();
      
      this.musicGainNode.connect(this.audioContext.destination);
      this.sfxGainNode.connect(this.audioContext.destination);
      
      this.musicGainNode.gain.value = this.musicVolume;
      this.sfxGainNode.gain.value = this.sfxVolume;
    }
  }

  // Background music - simple ambient loop
  startBackgroundMusic() {
    if (!this.audioContext || !this.musicGainNode || this.isMusicPlaying) return;
    
    this.isMusicPlaying = true;
    this.playAmbientMusic();
  }

  private playAmbientMusic() {
    if (!this.audioContext || !this.musicGainNode) return;

    // Create a simple ambient chord progression
    const notes = [
      { freq: 261.63, duration: 2 }, // C4
      { freq: 329.63, duration: 2 }, // E4
      { freq: 392.00, duration: 2 }, // G4
      { freq: 329.63, duration: 2 }, // E4
    ];

    let time = this.audioContext.currentTime;
    
    notes.forEach((note) => {
      const osc = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = note.freq;
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.1, time + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.05, time + note.duration - 0.1);
      gainNode.gain.linearRampToValueAtTime(0, time + note.duration);
      
      osc.connect(gainNode);
      gainNode.connect(this.musicGainNode!);
      
      osc.start(time);
      osc.stop(time + note.duration);
      
      time += note.duration;
    });

    // Loop the music
    if (this.isMusicPlaying) {
      setTimeout(() => this.playAmbientMusic(), 8000);
    }
  }

  stopBackgroundMusic() {
    this.isMusicPlaying = false;
  }

  // Click sound effect
  playClickSound() {
    if (!this.audioContext || !this.sfxGainNode) return;

    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = 800;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(this.sfxGainNode);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  // Success sound effect
  playSuccessSound() {
    if (!this.audioContext || !this.sfxGainNode) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    let time = this.audioContext.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0.2, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
      
      osc.connect(gainNode);
      gainNode.connect(this.sfxGainNode!);
      
      osc.start(time);
      osc.stop(time + 0.2);
      
      time += 0.15;
    });
  }

  // Failure sound effect
  playFailureSound() {
    if (!this.audioContext || !this.sfxGainNode) return;

    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(this.sfxGainNode);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.musicVolume;
    }
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.sfxVolume;
    }
  }

  getMusicVolume() {
    return this.musicVolume;
  }

  getSfxVolume() {
    return this.sfxVolume;
  }
}

// Singleton instance
export const audioSystem = new AudioSystem();
