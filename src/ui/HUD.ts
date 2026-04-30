import { createMuteButton, type MuteButtonHandle } from './createMuteButton';

export class HUD {
  private container: HTMLDivElement | null = null;
  private stageNameEl: HTMLDivElement | null = null;
  private scoreEl: HTMLSpanElement | null = null;
  private starCountEl: HTMLSpanElement | null = null;
  private boostButton: HTMLButtonElement | null = null;
  private homeButton: HTMLButtonElement | null = null;
  private muteButton: HTMLButtonElement | null = null;
  private muteHandle: MuteButtonHandle | null = null;
  private cooldownContainer: HTMLDivElement | null = null;
  private cooldownBar: HTMLDivElement | null = null;
  private stageProgressContainer: HTMLDivElement | null = null;
  private stageProgressFill: HTMLDivElement | null = null;
  private stageProgressGoalEl: HTMLDivElement | null = null;
  private onBoostCallback: (() => void) | null = null;
  private onBoostDeniedCallback: (() => void) | null = null;
  private onHomeCallback: (() => void) | null = null;
  private onMuteCallback: (() => void) | null = null;
  private muted = false;
  private lastCooldownProgress = 1.0;
  // Differential write caches for updateCooldown.
  // NOTE: If a future code path mutates cooldownBar / boostButton styles
  // outside of updateCooldown, these caches may become stale and need to
  // be invalidated explicitly.
  private lastCooldownPct = -1;
  private lastReadyState: boolean | null = null;
  // Differential write cache for updateStageProgress (same pattern as
  // updateCooldown). -1 sentinel guarantees the first valid call writes.
  private lastStageProgressPct = -1;
  private lastStageProgressComplete: boolean | null = null;
  // Differential write caches for update(score, starCount) to avoid
  // redundant textContent writes (which can trigger layout/paint on iPad Safari).
  private lastScore = -1;
  private lastStarCount = -1;

  show(stageName?: string, planetColor?: number): void {
    const hudRoot = document.getElementById('hud');
    if (!hudRoot) return;

    // Ensure HUD root has proper z-index
    hudRoot.style.zIndex = '10';

    // Home button (top-left)
    this.homeButton = document.createElement('button');
    this.homeButton.textContent = '🏠';
    this.homeButton.setAttribute('aria-label', 'ホームへ もどる');
    this.homeButton.style.position = 'absolute';
    this.homeButton.style.top = '0.8rem';
    this.homeButton.style.left = 'max(1rem, calc(env(safe-area-inset-left, 0px) + 0.5rem))';
    this.homeButton.style.fontSize = 'clamp(1.4rem, 4vmin, 1.8rem)';
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
    this.homeButton.style.transform = 'scale(1)';
    this.homeButton.style.transition = 'transform 0.08s ease-out';
    const releaseHomePress = (): void => {
      if (this.homeButton) {
        this.homeButton.style.transform = 'scale(1)';
      }
    };
    this.homeButton.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      if (this.homeButton) {
        this.homeButton.style.transform = 'scale(0.9)';
      }
      this.onHomeCallback?.();
    });
    this.homeButton.addEventListener('pointerup', releaseHomePress);
    this.homeButton.addEventListener('pointercancel', releaseHomePress);
    this.homeButton.addEventListener('pointerleave', releaseHomePress);
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

    // Stage progress bar (🚀 ─── 🪐) under the stage name.
    this.createStageProgress(hudRoot, planetColor);

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

    // Mute toggle button on HUD root (top-right) — created after stage name
    // and other elements so existing children indices remain stable.
    this.createMuteButton();
  }

  private createStageProgress(hudRoot: HTMLElement, planetColor?: number): void {
    const colorHex = this.toCssColor(planetColor ?? 0xffd700);

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-stage-progress-container', '');
    wrapper.setAttribute('role', 'progressbar');
    wrapper.setAttribute('aria-label', 'ゴールまでの すすみ');
    wrapper.setAttribute('aria-valuemin', '0');
    wrapper.setAttribute('aria-valuemax', '100');
    wrapper.setAttribute('aria-valuenow', '0');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.gap = '0.4rem';
    wrapper.style.margin = '0 auto 0.4rem';
    wrapper.style.width = 'clamp(160px, 32vmin, 280px)';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.fontFamily = "'Zen Maru Gothic', sans-serif";

    const shipIcon = document.createElement('div');
    shipIcon.setAttribute('data-stage-progress-ship', '');
    shipIcon.textContent = '🚀';
    shipIcon.style.fontSize = 'clamp(0.9rem, 2.4vmin, 1.1rem)';
    shipIcon.style.lineHeight = '1';
    shipIcon.style.pointerEvents = 'none';

    const track = document.createElement('div');
    track.setAttribute('data-stage-progress-track', '');
    track.style.flex = '1';
    track.style.height = '14px';
    track.style.background = 'rgba(255, 255, 255, 0.18)';
    track.style.borderRadius = '7px';
    track.style.overflow = 'hidden';
    track.style.boxShadow = 'inset 0 2px 6px rgba(0, 0, 0, 0.35)';

    const fill = document.createElement('div');
    fill.setAttribute('data-stage-progress-fill', '');
    fill.style.height = '100%';
    fill.style.width = '0%';
    fill.style.borderRadius = '7px';
    fill.style.background = `linear-gradient(90deg, #00ddff, ${colorHex})`;
    fill.style.transition = 'width 0.15s linear';
    fill.setAttribute('data-stage-progress-color', colorHex);
    track.appendChild(fill);

    const goalIcon = document.createElement('div');
    goalIcon.setAttribute('data-stage-progress-goal', '');
    goalIcon.textContent = '🪐';
    goalIcon.style.fontSize = 'clamp(0.9rem, 2.4vmin, 1.1rem)';
    goalIcon.style.lineHeight = '1';
    goalIcon.style.pointerEvents = 'none';
    goalIcon.style.textShadow = `0 0 8px ${colorHex}`;

    wrapper.appendChild(shipIcon);
    wrapper.appendChild(track);
    wrapper.appendChild(goalIcon);
    hudRoot.appendChild(wrapper);

    this.stageProgressContainer = wrapper;
    this.stageProgressFill = fill;
    this.stageProgressGoalEl = goalIcon;
  }

  private toCssColor(hex: number): string {
    const clamped = Math.max(0, Math.min(0xffffff, Math.floor(hex)));
    return `#${clamped.toString(16).padStart(6, '0')}`;
  }

  private createMuteButton(): void {
    const hudRoot = document.getElementById('hud');
    if (!hudRoot) return;

    this.muteHandle = createMuteButton({
      initialMuted: this.muted,
      container: hudRoot,
      onToggle: () => this.onMuteCallback?.(),
    });
    this.muteButton = this.muteHandle.element;
  }

  private createBoostButton(): void {
    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    // Inject boost animations
    this.injectBoostAnimations();

    this.boostButton = document.createElement('button');
    this.boostButton.textContent = '🚀 ブースト!';
    this.boostButton.setAttribute('aria-label', 'ブースト');
    this.boostButton.setAttribute('aria-disabled', 'false');
    this.boostButton.style.position = 'absolute';
    this.boostButton.style.bottom = 'max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))';
    this.boostButton.style.right = 'max(2rem, calc(env(safe-area-inset-right, 0px) + 1rem))';
    this.boostButton.style.fontFamily = "'Zen Maru Gothic', sans-serif";
    this.boostButton.style.fontSize = 'clamp(1rem, 3.5vmin, 1.3rem)';
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
      if (!this.boostButton) return;

      if (this.lastCooldownProgress < 1.0) {
        if (this.boostButton.hasAttribute('data-boost-shake')) return;
        this.boostButton.setAttribute('data-boost-shake', '');
        setTimeout(() => {
          if (this.boostButton) {
            this.boostButton.removeAttribute('data-boost-shake');
          }
        }, 250);
        this.onBoostDeniedCallback?.();
        return;
      }

      this.boostButton.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (this.boostButton) {
          this.boostButton.style.transform = 'scale(1.0)';
        }
      }, 150);
      this.onBoostCallback?.();
    });

    uiOverlay.appendChild(this.boostButton);

    // Cooldown indicator below boost button
    this.cooldownContainer = document.createElement('div');
    this.cooldownContainer.setAttribute('data-cooldown-container', '');
    this.cooldownContainer.style.cssText = `
      position: absolute;
      bottom: max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.5rem));
      right: max(2rem, calc(env(safe-area-inset-right, 0px) + 1rem));
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
      @keyframes boostShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-4px); }
        40% { transform: translateX(4px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
      button[data-boost-shake] {
        animation: boostShake 0.25s ease-in-out 1 !important;
      }
      @keyframes boostBtnReadyFlash {
        0%   { transform: scale(1.0); }
        40%  { transform: scale(1.18); }
        100% { transform: scale(1.0); }
      }
      button[data-boost-ready-flash] {
        animation: boostBtnReadyFlash 0.45s ease-out 1 !important;
      }
      @keyframes stageGoalFlash {
        0%   { transform: scale(1.0); }
        40%  { transform: scale(1.35); }
        100% { transform: scale(1.0); }
      }
      span[data-stage-goal-flash], div[data-stage-goal-flash] {
        animation: stageGoalFlash 0.45s ease-out 1;
        display: inline-block;
      }
    `;
    document.head.appendChild(style);
  }

  setBoostCallback(callback: () => void): void {
    this.onBoostCallback = callback;
  }

  setBoostDeniedCallback(callback: () => void): void {
    this.onBoostDeniedCallback = callback;
  }

  setHomeCallback(callback: () => void): void {
    this.onHomeCallback = callback;
  }

  setMuteCallback(callback: () => void): void {
    this.onMuteCallback = callback;
  }

  /**
   * Update the mute button display to reflect the given state.
   * Safe to call before or after show(); the latest value is used the next
   * time the button is created.
   */
  setMuteState(muted: boolean): void {
    this.muted = muted;
    this.muteHandle?.setMuted(muted);
  }

  isMuted(): boolean {
    return this.muted;
  }

  update(score: number, starCount: number): void {
    if (this.scoreEl && score !== this.lastScore) {
      this.scoreEl.textContent = String(score);
      this.lastScore = score;
    }
    if (this.starCountEl && starCount !== this.lastStarCount) {
      this.starCountEl.textContent = String(starCount);
      this.lastStarCount = starCount;
    }
  }

  updateCooldown(progress: number): void {
    if (!this.cooldownBar || !this.boostButton) return;

    const clamped = Math.max(0, Math.min(1, progress));
    const pct = Math.round(clamped * 100);
    if (pct !== this.lastCooldownPct) {
      this.cooldownBar.style.width = `${pct}%`;
      this.lastCooldownPct = pct;
    }

    const ready = progress >= 1.0;
    if (ready !== this.lastReadyState) {
      if (ready) {
        this.cooldownBar.style.boxShadow = '0 0 10px #00ff88';
        this.boostButton.style.opacity = '1';
        this.boostButton.style.filter = 'none';
        this.boostButton.style.animation = 'boostBtnPulse 2s ease-in-out infinite';
        this.boostButton.setAttribute('aria-disabled', 'false');
      } else {
        this.cooldownBar.style.boxShadow = 'none';
        this.boostButton.style.opacity = '0.5';
        this.boostButton.style.filter = 'grayscale(0.8)';
        this.boostButton.style.animation = 'none';
        this.boostButton.setAttribute('aria-disabled', 'true');
        // Clear ready-flash attribute if cooldown restarts mid-flash so the
        // pulse doesn't linger on a disabled button.
        this.clearBoostReadyFlash();
      }
      this.lastReadyState = ready;
    }

    this.lastCooldownProgress = progress;
  }

  /**
   * Update the stage progress bar (🚀 ─── 🪐). Uses the same differential
   * write pattern as updateCooldown so per-frame DOM writes are skipped
   * when the integer percentage hasn't changed.
   */
  updateStageProgress(progress: number): void {
    if (!this.stageProgressContainer || !this.stageProgressFill) return;

    const clamped = Math.max(0, Math.min(1, progress));
    const pct = Math.round(clamped * 100);

    if (pct !== this.lastStageProgressPct) {
      this.stageProgressFill.style.width = `${pct}%`;
      this.stageProgressContainer.setAttribute('aria-valuenow', String(pct));
      this.lastStageProgressPct = pct;
    }

    const complete = clamped >= 1.0;
    if (complete !== this.lastStageProgressComplete) {
      if (complete) {
        this.stageProgressContainer.setAttribute('data-stage-progress-complete', '');
        this.flashStageGoal();
      } else {
        this.stageProgressContainer.removeAttribute('data-stage-progress-complete');
      }
      this.lastStageProgressComplete = complete;
    }
  }

  private flashStageGoal(): void {
    const goal = this.stageProgressGoalEl;
    if (!goal) return;
    if (goal.hasAttribute('data-stage-goal-flash')) return;
    goal.setAttribute('data-stage-goal-flash', '');
    let cleared = false;
    const cleanup = (): void => {
      if (cleared) return;
      cleared = true;
      goal.removeAttribute('data-stage-goal-flash');
      goal.removeEventListener('animationend', onEnd);
    };
    const onEnd = (ev: AnimationEvent): void => {
      if (ev.animationName !== 'stageGoalFlash') return;
      cleanup();
    };
    goal.addEventListener('animationend', onEnd);
    setTimeout(cleanup, 500);
  }

  /**
   * Trigger a one-shot scale pulse on the boost button to visually signal
   * "boost is ready again". Safe to call multiple times: re-entrant calls
   * while the flash is in progress are ignored (no re-trigger).
   * After the flash completes, the button returns to its standard
   * `boostBtnPulse` loop animation.
   */
  flashBoostReady(): void {
    const btn = this.boostButton;
    if (!btn) return;
    if (btn.hasAttribute('data-boost-ready-flash')) return;

    btn.setAttribute('data-boost-ready-flash', '');

    let cleared = false;
    const cleanup = () => {
      if (cleared) return;
      cleared = true;
      btn.removeAttribute('data-boost-ready-flash');
      btn.removeEventListener('animationend', onEnd);
      // Restore the standard ready-state pulse loop in case the !important
      // flash animation overrode the inline style cascade.
      if (this.lastReadyState === true) {
        btn.style.animation = 'boostBtnPulse 2s ease-in-out infinite';
      }
    };
    const onEnd = (ev: AnimationEvent) => {
      if (ev.animationName !== 'boostBtnReadyFlash') return;
      cleanup();
    };
    btn.addEventListener('animationend', onEnd);
    // Fallback for iPad Safari where animationend may not fire (e.g., tab
    // switch interrupts the CSS animation). Slightly longer than the
    // 0.45s keyframe to allow the natural event to win when present.
    setTimeout(cleanup, 500);
  }

  private clearBoostReadyFlash(): void {
    if (this.boostButton?.hasAttribute('data-boost-ready-flash')) {
      this.boostButton.removeAttribute('data-boost-ready-flash');
    }
  }

  hide(): void {
    if (this.homeButton) {
      this.homeButton.remove();
      this.homeButton = null;
    }
    if (this.muteHandle) {
      this.muteHandle.remove();
      this.muteHandle = null;
    }
    this.muteButton = null;
    if (this.stageNameEl) {
      this.stageNameEl.remove();
      this.stageNameEl = null;
    }
    if (this.stageProgressContainer) {
      this.stageProgressContainer.remove();
      this.stageProgressContainer = null;
    }
    this.stageProgressFill = null;
    this.stageProgressGoalEl = null;
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
    this.lastCooldownPct = -1;
    this.lastReadyState = null;
    this.lastStageProgressPct = -1;
    this.lastStageProgressComplete = null;
    this.lastScore = -1;
    this.lastStarCount = -1;
    this.scoreEl = null;
    this.starCountEl = null;
  }
}
