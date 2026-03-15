import * as THREE from 'three';

export type SoundEffect = 'starCollect' | 'meteoriteHit' | 'stageClear' | 'boost';

export class AudioManager {
  private listener: THREE.AudioListener | null = null;
  private bgm: THREE.Audio | null = null;
  private initialized = false;

  async init(camera: THREE.Camera): Promise<void> {
    try {
      this.listener = new THREE.AudioListener();
      camera.add(this.listener);

      // Resume AudioContext (required for iPad Safari)
      const ctx = this.listener.context;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      this.bgm = new THREE.Audio(this.listener);
      this.initialized = true;
    } catch {
      // Audio init may fail, game continues without sound
      this.initialized = false;
    }
  }

  playBGM(): void {
    // BGM playback - requires audio files to be loaded
    // Placeholder: will load from public/audio/ when assets are added
  }

  stopBGM(): void {
    if (this.bgm?.isPlaying) {
      this.bgm.stop();
    }
  }

  playSpatialSFX(_effect: SoundEffect, _position: THREE.Vector3): void {
    if (!this.initialized || !this.listener) return;
    // Spatial SFX - requires audio files
  }

  playSFX(_effect: SoundEffect): void {
    if (!this.initialized || !this.listener) return;
    // Non-spatial SFX - requires audio files
  }

  dispose(): void {
    this.stopBGM();
    if (this.listener) {
      this.listener.parent?.remove(this.listener);
      this.listener = null;
    }
    this.initialized = false;
  }
}
