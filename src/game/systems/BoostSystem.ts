export class BoostSystem {
  private active = false;
  private available = true;
  private durationTimer = 0;
  private cooldownTimer = 0;

  private static readonly DURATION = 3.0;
  private static readonly COOLDOWN = 5.0;

  activate(): boolean {
    if (!this.available || this.active) return false;
    this.active = true;
    this.available = false;
    this.durationTimer = BoostSystem.DURATION;
    return true;
  }

  update(deltaTime: number): void {
    if (this.active) {
      this.durationTimer -= deltaTime;
      if (this.durationTimer <= 0) {
        this.active = false;
        this.cooldownTimer = BoostSystem.COOLDOWN;
      }
    } else if (!this.available) {
      this.cooldownTimer -= deltaTime;
      if (this.cooldownTimer <= 0) {
        this.available = true;
        this.cooldownTimer = 0;
      }
    }
  }

  cancel(): void {
    if (this.active) {
      this.active = false;
      this.cooldownTimer = BoostSystem.COOLDOWN;
    }
  }

  isAvailable(): boolean {
    return this.available;
  }

  isActive(): boolean {
    return this.active;
  }

  reset(): void {
    this.active = false;
    this.available = true;
    this.durationTimer = 0;
    this.cooldownTimer = 0;
  }
}
