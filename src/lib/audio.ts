// src/lib/audio.ts
// File-based audio system using Web Audio API (works with /public/audio/*)

type SoundKey = "click" | "success" | "failure" | "music";

class AudioSystem {
  private ctx: AudioContext | null = null;

  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private buffers = new Map<SoundKey, AudioBuffer>();

  private musicSource: AudioBufferSourceNode | null = null;
  private isMusicPlaying = false;

  private musicVolume = 0.3;
  private sfxVolume = 0.5;

  // Default file locations (you can change these)
  private urls: Record<SoundKey, string> = {
    click: "/audio/click.mp3",
    success: "/audio/success.mp3",
    failure: "/audio/failure.mp3",
    music: "/audio/music.mp3",
  };

  /** Call once somewhere like on first user interaction, or TitleScreen */
  initialize(customUrls?: Partial<Record<SoundKey, string>>) {
    if (typeof window === "undefined") return;

    if (customUrls) this.urls = { ...this.urls, ...customUrls };

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain.gain.value = this.musicVolume;
      this.sfxGain.gain.value = this.sfxVolume;
      this.masterGain.gain.value = 1;
    }
  }

  /** Browsers often require a gesture before audio can start */
  private async resumeIfNeeded() {
    if (!this.ctx) return;
    if (this.ctx.state === "running") return;
    try {
      await this.ctx.resume();
    } catch {
      // If resume fails (no user gesture), just do nothing.
    }
  }

  /** Preload one sound into memory */
  private async loadSound(key: SoundKey) {
    if (!this.ctx) return;
    if (this.buffers.has(key)) return;

    const res = await fetch(this.urls[key]);
    if (!res.ok) throw new Error(`Failed to load sound: ${key} (${this.urls[key]})`);

    const arr = await res.arrayBuffer();
    const buf = await this.ctx.decodeAudioData(arr);
    this.buffers.set(key, buf);
  }

  /** Preload all sounds (recommended) */
  async preloadAll() {
    this.initialize();
    if (!this.ctx) return;

    await this.resumeIfNeeded();
    await Promise.all([
      this.loadSound("click"),
      this.loadSound("success"),
      this.loadSound("failure"),
      this.loadSound("music"),
    ]);
  }

  /** Plays a sound buffer through the given gain node */
  private playBuffer(key: SoundKey, destination: GainNode, opts?: { loop?: boolean }) {
    if (!this.ctx) return;
    const buf = this.buffers.get(key);
    if (!buf) return;

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = !!opts?.loop;
    src.connect(destination);
    src.start(0);

    return src;
  }

  // -------------------------
  // SFX
  // -------------------------
  playClickSound() {
    void this.playSfx("click");
  }

  playSuccessSound() {
    void this.playSfx("success");
  }

  playFailureSound() {
    void this.playSfx("failure");
  }

  private async playSfx(key: Exclude<SoundKey, "music">) {
    this.initialize();
    if (!this.ctx || !this.sfxGain) return;

    await this.resumeIfNeeded();
    if (!this.buffers.has(key)) {
      try {
        await this.loadSound(key);
      } catch {
        return;
      }
    }

    this.playBuffer(key, this.sfxGain);
  }

  // -------------------------
  // Music
  // -------------------------
  async startBackgroundMusic() {
    this.initialize();
    if (!this.ctx || !this.musicGain) return;
    if (this.isMusicPlaying) return;

    await this.resumeIfNeeded();

    if (!this.buffers.has("music")) {
      try {
        await this.loadSound("music");
      } catch {
        return;
      }
    }

    this.stopBackgroundMusic(); // ensure clean restart
    this.isMusicPlaying = true;

    this.musicSource = this.playBuffer("music", this.musicGain, { loop: true }) ?? null;
  }

  stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicSource) {
      try {
        this.musicSource.stop();
      } catch {}
      this.musicSource.disconnect();
      this.musicSource = null;
    }
  }

  // -------------------------
  // Volume controls
  // -------------------------
  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain) this.musicGain.gain.value = this.musicVolume;
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain) this.sfxGain.gain.value = this.sfxVolume;
  }

  getMusicVolume() {
    return this.musicVolume;
  }

  getSfxVolume() {
    return this.sfxVolume;
  }
}

export const audioSystem = new AudioSystem();
