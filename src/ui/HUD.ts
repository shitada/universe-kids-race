import { createMuteButton, type MuteButtonHandle } from './createMuteButton';
import { HomeConfirmOverlay } from './HomeConfirmOverlay';
import { PauseOverlay } from './PauseOverlay';

export class HUD {
  private container: HTMLDivElement | null = null;
  private stageNameEl: HTMLDivElement | null = null;
  private assistMessageEl: HTMLDivElement | null = null;
  private scoreEl: HTMLSpanElement | null = null;
  private starCountEl: HTMLSpanElement | null = null;
  private bestStarContainerEl: HTMLSpanElement | null = null;
  private bestStarCountEl: HTMLSpanElement | null = null;
  private boostButton: HTMLButtonElement | null = null;
  private boostHintEl: HTMLDivElement | null = null;
  private homeButton: HTMLButtonElement | null = null;
  private pauseButton: HTMLButtonElement | null = null;
  private homeConfirmOverlay: HomeConfirmOverlay = new HomeConfirmOverlay();
  private pauseOverlay: PauseOverlay = new PauseOverlay();
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
  private onHomeConfirmOpenCallback: (() => void) | null = null;
  private onHomeConfirmCancelCallback: (() => void) | null = null;
  private onPauseOpenCallback: (() => boolean | void) | null = null;
  private onPauseResumeCallback: (() => void) | null = null;
  private onMuteCallback: (() => void) | null = null;
  private muted = false;
  private boostLocked = false;
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
  // Personal best (⭐) sub-label state. bestStarCount is the value passed via
  // setBestStarCount() (0 = unset / never cleared, hides the sub-label).
  // lastBestStarCount caches the last DOM-written value to skip redundant
  // textContent writes (Constitution IV: 60fps差分書き込み).
  // bestStarPulsed guards the one-shot pulse so we only flash once when the
  // child crosses their previous best within a single stage entry.
  private bestStarCount = 0;
  private lastBestStarCount = -1;
  private bestStarPulsed = false;

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
    this.homeButton.style.left = '1rem';
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
      if (this.homeConfirmOverlay.isVisible()) {
        return;
      }
      if (!document.getElementById('ui-overlay')) {
        return;
      }
      // Show child-friendly confirmation overlay instead of firing
      // onHomeCallback immediately, to prevent accidental taps from
      // losing stage progress (Constitution I: 子供ファースト).
      this.onHomeConfirmOpenCallback?.();
      this.homeConfirmOverlay.show(
        () => this.onHomeCallback?.(),
        () => this.onHomeConfirmCancelCallback?.(),
      );
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
        padding: 0.5rem;
        pointer-events: none;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
      `;
      hudRoot.appendChild(this.stageNameEl);
    }

    this.assistMessageEl = document.createElement('div');
    this.assistMessageEl.setAttribute('data-hud-assist-message', '');
    this.assistMessageEl.style.cssText = `
      display: none;
      margin: 0 auto 0.5rem;
      width: fit-content;
      max-width: min(88vw, 560px);
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
      color: #fff7bf;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.2vmin, 1.15rem);
      font-weight: 700;
      text-align: center;
      pointer-events: none;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16);
    `;
    hudRoot.appendChild(this.assistMessageEl);

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

    // Personal best sub-label: ベスト ⭐N. Hidden until setBestStarCount(>0)
    // is called (e.g. fresh stage with no previous record). Uses a small,
    // low-contrast 宇宙テーマ薄青色 so the main star count stays dominant.
    this.bestStarContainerEl = document.createElement('span');
    this.bestStarContainerEl.setAttribute('data-hud-best-star', '');
    this.bestStarContainerEl.style.cssText = `
      margin-left: 0.6rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.6em;
      font-weight: 700;
      color: #9ec5ff;
      opacity: 0.7;
      display: none;
      vertical-align: middle;
      transform-origin: center;
    `;
    this.bestStarContainerEl.textContent = 'ベスト ⭐';
    this.bestStarCountEl = document.createElement('span');
    this.bestStarCountEl.textContent = '0';
    this.bestStarContainerEl.appendChild(this.bestStarCountEl);
    starDiv.appendChild(this.bestStarContainerEl);

    this.container.appendChild(scoreDiv);
    this.container.appendChild(starDiv);
    hudRoot.appendChild(this.container);

    // Boost button on ui-overlay
    this.createBoostButton();

    this.createPauseButton(hudRoot);

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

  private createPauseButton(hudRoot: HTMLElement): void {
    this.pauseButton = document.createElement('button');
    this.pauseButton.textContent = '⏸ やすむ';
    this.pauseButton.setAttribute('aria-label', 'やすむ');
    this.pauseButton.style.position = 'absolute';
    this.pauseButton.style.top = '0.8rem';
    this.pauseButton.style.left = '4.5rem';
    this.pauseButton.style.minWidth = '6rem';
    this.pauseButton.style.minHeight = '3rem';
    this.pauseButton.style.padding = '0 1rem';
    this.pauseButton.style.border = 'none';
    this.pauseButton.style.borderRadius = '999px';
    this.pauseButton.style.background = 'rgba(255, 255, 255, 0.16)';
    this.pauseButton.style.color = '#fff';
    this.pauseButton.style.fontFamily = "'Zen Maru Gothic', sans-serif";
    this.pauseButton.style.fontSize = 'clamp(1rem, 3.2vmin, 1.2rem)';
    this.pauseButton.style.fontWeight = '900';
    this.pauseButton.style.cursor = 'pointer';
    this.pauseButton.style.pointerEvents = 'auto';
    this.pauseButton.style.touchAction = 'manipulation';
    this.pauseButton.style.transform = 'scale(1)';
    this.pauseButton.style.transition = 'transform 0.08s ease-out';

    const releasePausePress = (): void => {
      if (this.pauseButton) {
        this.pauseButton.style.transform = 'scale(1)';
      }
    };

    this.pauseButton.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
      if (this.pauseButton) {
        this.pauseButton.style.transform = 'scale(0.96)';
      }
      if (this.pauseOverlay.isVisible() || this.homeConfirmOverlay.isVisible()) {
        return;
      }
      if (!document.getElementById('ui-overlay')) {
        return;
      }
      const shouldOpen = this.onPauseOpenCallback?.() !== false;
      if (!shouldOpen) {
        return;
      }
      this.pauseOverlay.show(() => this.onPauseResumeCallback?.());
    });
    this.pauseButton.addEventListener('pointerup', releasePausePress);
    this.pauseButton.addEventListener('pointercancel', releasePausePress);
    this.pauseButton.addEventListener('pointerleave', releasePausePress);
    hudRoot.appendChild(this.pauseButton);
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
    this.boostButton.style.bottom = '2rem';
    this.boostButton.style.right = '2rem';
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
      if (this.boostLocked) return;

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

    this.boostHintEl = document.createElement('div');
    this.boostHintEl.setAttribute('data-boost-hint', '');
    this.boostHintEl.setAttribute('aria-hidden', 'true');
    this.boostHintEl.style.cssText = `
      position: absolute;
      right: 2rem;
      bottom: 6.25rem;
      display: none;
      max-width: min(54vw, 240px);
      padding: 0.45rem 0.85rem;
      border-radius: 999px;
      background: rgba(14, 20, 60, 0.9);
      border: 2px solid rgba(255, 217, 61, 0.9);
      color: #fff7bf;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.2vmin, 1.12rem);
      font-weight: 700;
      text-align: center;
      pointer-events: none;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
      transform-origin: right bottom;
      z-index: 12;
      white-space: nowrap;
    `;
    uiOverlay.appendChild(this.boostHintEl);

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
    this.cooldownContainer.style.position = 'absolute';
    this.cooldownContainer.style.bottom = '1rem';
    this.cooldownContainer.style.right = '2rem';

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
    this.applyBoostButtonState();
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
      @keyframes boostHintBob {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-4px) scale(1.04); }
      }
      [data-boost-hint][data-boost-hint-visible] {
        animation: boostHintBob 0.9s ease-in-out infinite;
      }
      button[data-boost-hint-active] {
        box-shadow:
          0 0 0 6px rgba(255, 217, 61, 0.18),
          0 10px 28px rgba(255, 107, 107, 0.62);
        transform: scale(1.08);
      }
      div[data-cooldown-container][data-boost-hint-active] {
        box-shadow: 0 0 14px rgba(255, 217, 61, 0.9);
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
      @keyframes hudCountPop {
        0%   { transform: scale(1.0); }
        40%  { transform: scale(1.25); }
        100% { transform: scale(1.0); }
      }
      span[data-hud-count-pop] {
        animation: hudCountPop 0.35s ease-out 1;
        display: inline-block;
        transform-origin: center;
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

  setBoostLocked(locked: boolean): void {
    this.boostLocked = locked;
    this.applyBoostButtonState();
  }

  setHomeCallback(callback: () => void): void {
    this.onHomeCallback = callback;
  }

  setHomeConfirmOpenCallback(callback: () => void): void {
    this.onHomeConfirmOpenCallback = callback;
  }

  setHomeConfirmCancelCallback(callback: () => void): void {
    this.onHomeConfirmCancelCallback = callback;
  }

  setMuteCallback(callback: () => void): void {
    this.onMuteCallback = callback;
  }

  setPauseOpenCallback(callback: () => boolean | void): void {
    this.onPauseOpenCallback = callback;
  }

  setPauseResumeCallback(callback: () => void): void {
    this.onPauseResumeCallback = callback;
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

  showAssistMessage(message: string): void {
    if (!this.assistMessageEl) return;
    this.assistMessageEl.textContent = message;
    this.assistMessageEl.style.display = 'block';
  }

  hideAssistMessage(): void {
    if (!this.assistMessageEl) return;
    this.assistMessageEl.style.display = 'none';
    this.assistMessageEl.textContent = '';
  }

  showBoostHint(message: string): void {
    if (!this.boostHintEl || !this.boostButton || !this.cooldownContainer) return;
    this.boostHintEl.textContent = message;
    this.boostHintEl.style.display = 'block';
    this.boostHintEl.setAttribute('data-boost-hint-visible', '');
    this.boostHintEl.setAttribute('aria-hidden', 'false');
    this.boostButton.setAttribute('data-boost-hint-active', '');
    this.cooldownContainer.setAttribute('data-boost-hint-active', '');
  }

  hideBoostHint(): void {
    if (this.boostHintEl) {
      this.boostHintEl.style.display = 'none';
      this.boostHintEl.textContent = '';
      this.boostHintEl.removeAttribute('data-boost-hint-visible');
      this.boostHintEl.setAttribute('aria-hidden', 'true');
    }
    this.boostButton?.removeAttribute('data-boost-hint-active');
    this.cooldownContainer?.removeAttribute('data-boost-hint-active');
  }

  isMuted(): boolean {
    return this.muted;
  }

  update(score: number, starCount: number): void {
    if (this.scoreEl && score !== this.lastScore) {
      const prev = this.lastScore;
      this.scoreEl.textContent = String(score);
      this.lastScore = score;
      if (prev !== -1 && score > prev) {
        this.flashCount(this.scoreEl);
      }
    }
    if (this.starCountEl && starCount !== this.lastStarCount) {
      const prev = this.lastStarCount;
      this.starCountEl.textContent = String(starCount);
      this.lastStarCount = starCount;
      if (prev !== -1 && starCount > prev) {
        this.flashCount(this.starCountEl);
      }
    }
    // Pulse the best sub-label once when the child first surpasses their
    // previous personal best within this stage entry. Guarded by
    // bestStarPulsed so subsequent stars don't re-trigger.
    if (
      this.bestStarCount > 0 &&
      !this.bestStarPulsed &&
      starCount > this.bestStarCount &&
      this.bestStarContainerEl &&
      this.bestStarContainerEl.style.display !== 'none'
    ) {
      this.bestStarPulsed = true;
      this.flashCount(this.bestStarContainerEl);
    }
  }

  /**
   * Set the personal best ⭐ count for the current stage entry.
   * - stageBest <= 0 (or non-integer) → hides the sub-label.
   * - stageBest > 0 → shows `ベスト ⭐N` and resets the one-shot pulse guard,
   *   so re-entering the same stage with a new best immediately reflects it
   *   and a fresh pulse can fire if the child surpasses it again.
   */
  setBestStarCount(stageBest: number): void {
    const value = Number.isInteger(stageBest) && stageBest > 0 ? stageBest : 0;
    this.bestStarCount = value;
    this.bestStarPulsed = false;
    if (!this.bestStarContainerEl || !this.bestStarCountEl) return;
    if (value > 0) {
      if (this.lastBestStarCount !== value) {
        this.bestStarCountEl.textContent = String(value);
        this.lastBestStarCount = value;
      }
      this.bestStarContainerEl.style.display = '';
    } else {
      this.bestStarContainerEl.style.display = 'none';
      this.lastBestStarCount = -1;
    }
  }

  private flashCount(el: HTMLElement): void {
    if (el.hasAttribute('data-hud-count-pop')) return;
    el.setAttribute('data-hud-count-pop', '');
    let cleared = false;
    const cleanup = (): void => {
      if (cleared) return;
      cleared = true;
      el.removeAttribute('data-hud-count-pop');
      el.removeEventListener('animationend', onEnd);
    };
    const onEnd = (ev: AnimationEvent): void => {
      if (ev.animationName !== 'hudCountPop') return;
      cleanup();
    };
    el.addEventListener('animationend', onEnd);
    setTimeout(cleanup, 500);
  }

  updateCooldown(progress: number): void {
    if (!this.cooldownBar || !this.boostButton) return;

    const clamped = Math.max(0, Math.min(1, progress));
    const pct = Math.round(clamped * 100);
    if (pct !== this.lastCooldownPct) {
      this.cooldownBar.style.width = `${pct}%`;
      this.lastCooldownPct = pct;
    }

    this.lastCooldownProgress = clamped;

    const ready = clamped >= 1.0;
    if (ready !== this.lastReadyState) {
      this.lastReadyState = ready;
      this.applyBoostButtonState();
    }
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

  private applyBoostButtonState(): void {
    if (!this.cooldownBar || !this.boostButton) return;

    const ready = this.lastCooldownProgress >= 1.0;
    const enabled = ready && !this.boostLocked;

    this.cooldownBar.style.boxShadow = enabled ? '0 0 10px #00ff88' : 'none';
    this.boostButton.style.opacity = enabled ? '1' : '0.5';
    this.boostButton.style.filter = enabled ? 'none' : 'grayscale(0.8)';
    this.boostButton.style.animation = enabled ? 'boostBtnPulse 2s ease-in-out infinite' : 'none';
    this.boostButton.setAttribute('aria-disabled', enabled ? 'false' : 'true');

    if (!enabled) {
      this.clearBoostReadyFlash();
      this.hideBoostHint();
    }
  }

  hide(): void {
    this.homeConfirmOverlay.hide();
    this.pauseOverlay.hide();
    if (this.homeButton) {
      this.homeButton.remove();
      this.homeButton = null;
    }
    if (this.pauseButton) {
      this.pauseButton.remove();
      this.pauseButton = null;
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
    if (this.assistMessageEl) {
      this.assistMessageEl.remove();
      this.assistMessageEl = null;
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
    if (this.boostHintEl) {
      this.boostHintEl.remove();
      this.boostHintEl = null;
    }
    if (this.cooldownContainer) {
      this.cooldownContainer.remove();
      this.cooldownContainer = null;
    }
    this.cooldownBar = null;
    this.boostLocked = false;
    this.lastCooldownProgress = 1.0;
    this.lastCooldownPct = -1;
    this.lastReadyState = null;
    this.lastStageProgressPct = -1;
    this.lastStageProgressComplete = null;
    this.lastScore = -1;
    this.lastStarCount = -1;
    this.scoreEl = null;
    this.starCountEl = null;
    this.bestStarContainerEl = null;
    this.bestStarCountEl = null;
    this.bestStarCount = 0;
    this.lastBestStarCount = -1;
    this.bestStarPulsed = false;
  }
}
