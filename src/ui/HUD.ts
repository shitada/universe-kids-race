export class HUD {
  private container: HTMLDivElement | null = null;
  private stageNameEl: HTMLDivElement | null = null;
  private scoreEl: HTMLSpanElement | null = null;
  private starCountEl: HTMLSpanElement | null = null;
  private boostButton: HTMLButtonElement | null = null;
  private homeButton: HTMLButtonElement | null = null;
  private cooldownContainer: HTMLDivElement | null = null;
  private cooldownBar: HTMLDivElement | null = null;
  private onBoostCallback: (() => void) | null = null;
  private onHomeCallback: (() => void) | null = null;
  private lastCooldownProgress = 1.0;

  show(stageName?: string): void {
    const hudRoot = document.getElementById('hud');
    if (!hudRoot) return;

    // Ensure HUD root has proper z-index
    hudRoot.style.zIndex = '10';

    // Home button (top-left)
    this.homeButton = document.createElement('button');
    this.homeButton.textContent = '🏠';
    this.homeButton.style.position = 'absolute';
    this.homeButton.style.top = '0.8rem';
    this.homeButton.style.left = '1rem';
    this.homeButton.style.fontSize = '1.8rem';
    this.homeButton.style.background = 'rgba(255, 255, 255, 0.15)';
    this.homeButton.style.border = 'none';
    this.homeButton.style.borderRadius = '50%';
    this.homeButton.style.width = '3rem';
    this.homeButton.style.height = '3rem';
    this.homeButton.style.display = 'flex';
    this.homeButton.style.alignItems = 'center';
    this.homeButton.style.justifyContent = 'center';
    this.homeButton.style.cursor = 'pointer';
    this.homeButton.style.pointerEvents = 'auto';
    this.homeButton.style.touchAction = 'manipulation';
    this.homeButton.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.onHomeCallback?.();
    });
    hudRoot.appendChild(this.homeButton);

    // Stage name display
    if (stageName) {
      this.stageNameEl = document.createElement('div');
      this.stageNameEl.textContent = stageName;
      this.stageNameEl.style.cssText = `
        text-align: center;
        font-family: 'Zen Maru Gothic', sans-serif;
        color: #FFD700;
        font-size: 1.5rem;
        font-weight: 700;
        padding: calc(0.5rem + env(safe-area-inset-top, 0px)) 0.5rem 0.5rem;
        pointer-events: none;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
      `;
      hudRoot.appendChild(this.stageNameEl);
    }

    this.container = document.createElement('div');
    this.container.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      color: #fff;
      font-size: 1.4rem;
      font-weight: 700;
      pointer-events: none;
    `;

    const scoreDiv = document.createElement('div');
    this.scoreEl = document.createElement('span');
    scoreDiv.textContent = 'スコア: ';
    this.scoreEl.textContent = '0';
    scoreDiv.appendChild(this.scoreEl);

    const starDiv = document.createElement('div');
    starDiv.textContent = '⭐ ';
    this.starCountEl = document.createElement('span');
    this.starCountEl.textContent = '0';
    starDiv.appendChild(this.starCountEl);

    this.container.appendChild(scoreDiv);
    this.container.appendChild(starDiv);
    hudRoot.appendChild(this.container);

    // Boost button on ui-overlay
    this.createBoostButton();
  }

  private createBoostButton(): void {
    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    // Inject boost animations
    this.injectBoostAnimations();

    this.boostButton = document.createElement('button');
    this.boostButton.textContent = '🚀 ブースト!';
    this.boostButton.style.position = 'absolute';
    this.boostButton.style.bottom = '2rem';
    this.boostButton.style.right = '2rem';
    this.boostButton.style.fontFamily = "'Zen Maru Gothic', sans-serif";
    this.boostButton.style.fontSize = '1.3rem';
    this.boostButton.style.fontWeight = '700';
    this.boostButton.style.padding = '0.8rem 1.5rem';
    this.boostButton.style.border = 'none';
    this.boostButton.style.borderRadius = '2rem';
    this.boostButton.style.background = 'linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)';
    this.boostButton.style.color = '#fff';
    this.boostButton.style.cursor = 'pointer';
    this.boostButton.style.touchAction = 'manipulation';
    this.boostButton.style.pointerEvents = 'auto';
    this.boostButton.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
    this.boostButton.style.animation = 'boostBtnPulse 2s ease-in-out infinite';

    this.boostButton.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      if (this.boostButton) {
        this.boostButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
          if (this.boostButton) {
            this.boostButton.style.transform = 'scale(1.0)';
          }
        }, 150);
      }
      this.onBoostCallback?.();
    });

    uiOverlay.appendChild(this.boostButton);

    // Cooldown indicator below boost button
    this.cooldownContainer = document.createElement('div');
    this.cooldownContainer.setAttribute('data-cooldown-container', '');
    this.cooldownContainer.style.cssText = `
      position: absolute;
      bottom: 1rem;
      right: 2rem;
      width: 80px;
      height: 6px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.2);
      pointer-events: none;
    `;

    this.cooldownBar = document.createElement('div');
    this.cooldownBar.setAttribute('data-cooldown-bar', '');
    this.cooldownBar.style.cssText = `
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, #00ddff, #00ff88);
      transition: width 0.1s;
      width: 100%;
      box-shadow: none;
    `;

    this.cooldownContainer.appendChild(this.cooldownBar);
    uiOverlay.appendChild(this.cooldownContainer);
  }

  private injectBoostAnimations(): void {
    if (document.getElementById('boost-animations')) return;

    const style = document.createElement('style');
    style.id = 'boost-animations';
    style.textContent = `
      @keyframes boostBtnPulse {
        0%, 100% { transform: scale(1.0); }
        50% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
  }

  setBoostCallback(callback: () => void): void {
    this.onBoostCallback = callback;
  }

  setHomeCallback(callback: () => void): void {
    this.onHomeCallback = callback;
  }

  update(score: number, starCount: number): void {
    if (this.scoreEl) this.scoreEl.textContent = String(score);
    if (this.starCountEl) this.starCountEl.textContent = String(starCount);
  }

  updateCooldown(progress: number): void {
    if (!this.cooldownBar || !this.boostButton) return;

    const pct = Math.max(0, Math.min(1, progress)) * 100;
    this.cooldownBar.style.width = `${pct}%`;

    // Glow effect on completion
    if (progress >= 1.0) {
      this.cooldownBar.style.boxShadow = '0 0 10px #00ff88';
    } else {
      this.cooldownBar.style.boxShadow = 'none';
    }

    // Boost button cooldown visual state
    if (progress < 1.0) {
      this.boostButton.style.opacity = '0.5';
      this.boostButton.style.filter = 'grayscale(0.8)';
      this.boostButton.style.animation = 'none';
    } else {
      this.boostButton.style.opacity = '1';
      this.boostButton.style.filter = 'none';
      this.boostButton.style.animation = 'boostBtnPulse 2s ease-in-out infinite';
    }

    this.lastCooldownProgress = progress;
  }

  hide(): void {
    if (this.homeButton) {
      this.homeButton.remove();
      this.homeButton = null;
    }
    if (this.stageNameEl) {
      this.stageNameEl.remove();
      this.stageNameEl = null;
    }
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    if (this.boostButton) {
      this.boostButton.remove();
      this.boostButton = null;
    }
    if (this.cooldownContainer) {
      this.cooldownContainer.remove();
      this.cooldownContainer = null;
    }
    this.cooldownBar = null;
    this.lastCooldownProgress = 1.0;
    this.scoreEl = null;
    this.starCountEl = null;
  }
}
