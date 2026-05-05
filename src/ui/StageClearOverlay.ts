import type { PlanetEncyclopediaEntry } from '../types';
import { createStageMedalDisplay } from './stageMedalDisplay';
import { attachReleaseConfirmButton } from './attachReleaseConfirmButton';

export interface StageClearOverlayShowOptions {
  stageNumber: number;
  starCount: number;
  bestStarCount: number;
  isBestUpdated?: boolean;
  continueLabel: string;
  nextEntry?: PlanetEncyclopediaEntry;
  rewardEntry?: PlanetEncyclopediaEntry;
  onContinue: () => void;
  onRetry: () => void;
  onReward?: () => void;
}

export class StageClearOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private continueButton: HTMLButtonElement | null = null;
  private retryButton: HTMLButtonElement | null = null;
  private rewardButton: HTMLButtonElement | null = null;
  private isContinueEnabled = false;
  private hasHandledContinue = false;
  private isRewardOpen = false;
  private readonly buttonCleanups = new Set<() => void>();

  show(options: StageClearOverlayShowOptions): void {
    this.hide();

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.isContinueEnabled = false;
    this.hasHandledContinue = false;
    this.isRewardOpen = false;
    this.injectStageClearBurstAnimation();

    const overlay = document.createElement('div');
    overlay.setAttribute('data-stage-clear-overlay', '');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: safe center;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 32, 0.6);
      pointer-events: auto;
      touch-action: manipulation;
      z-index: 40;
      padding: 0.9rem;
      box-sizing: border-box;
      text-align: center;
      overflow-x: hidden;
      overflow-y: hidden;
      gap: 0.3rem;
    `;
    overlay.style.overflowY = 'hidden';
    this.overlayEl = overlay;

    this.appendClearCelebrationBurst();
    overlay.appendChild(this.createHeading('やったね！', `
      position: relative;
      z-index: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(2.3rem, 8vmin, 3rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
      margin-bottom: 0.5rem;
    `));

    if (options.isBestUpdated) {
      this.injectBestStageStarsAnimation();
      overlay.appendChild(this.createHeading(`✨ じこベストこうしん！ ⭐ ${options.starCount} こ`, `
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1rem, 3.8vmin, 1.15rem);
        font-weight: 700;
        color: #FFD700;
        margin-bottom: 0.35rem;
        text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
        animation: bestStageStarsPop 0.6s ease-out;
      `));
    }

    overlay.appendChild(this.createHeading(`⭐ ${options.starCount} こ あつめたよ！`, `
      position: relative;
      z-index: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.15rem, 4.2vmin, 1.35rem);
      font-weight: 700;
      color: #fff;
    `));

    overlay.appendChild(this.createMedalSummary(options.stageNumber, options.starCount, options.bestStarCount));

    if (options.nextEntry) {
      overlay.appendChild(this.createNextAdventureCard(options.nextEntry));
    }

    if (options.rewardEntry) {
      overlay.appendChild(this.createHeading(`${options.rewardEntry.emoji} ${options.rewardEntry.name}の ずかんカード ゲット！ なかまに なったよ！`, `
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(0.95rem, 3.2vmin, 1.08rem);
        font-weight: 700;
        color: #FFD700;
        margin-top: 0.45rem;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
      `));
    }

    overlay.appendChild(this.createActionButtons(options));
    uiOverlay.appendChild(overlay);
  }

  hide(): void {
    const cleanups = Array.from(this.buttonCleanups);
    this.buttonCleanups.clear();
    for (const cleanup of cleanups) {
      cleanup();
    }
    this.overlayEl?.remove();
    this.overlayEl = null;
    this.continueButton = null;
    this.retryButton = null;
    this.rewardButton = null;
    this.isContinueEnabled = false;
    this.hasHandledContinue = false;
    this.isRewardOpen = false;
  }

  enableContinue(): void {
    if (this.isContinueEnabled) return;
    if (!this.continueButton || !this.retryButton) return;

    this.isContinueEnabled = true;
    for (const button of [this.retryButton, this.continueButton]) {
      button.disabled = false;
      button.style.opacity = '1';
      button.style.visibility = 'visible';
      button.style.pointerEvents = 'auto';
    }
  }

  setRewardOpen(isOpen: boolean): void {
    this.isRewardOpen = isOpen;
    if (!this.rewardButton) return;
    this.rewardButton.style.pointerEvents = isOpen ? 'none' : 'auto';
    this.rewardButton.style.transform = 'scale(1)';
  }

  private createHeading(text: string, style: string): HTMLDivElement {
    const element = document.createElement('div');
    element.textContent = text;
    element.style.cssText = style;
    return element;
  }

  private createMedalSummary(
    stageNumber: number,
    starCount: number,
    bestStarCount: number,
  ): HTMLDivElement {
    const medalSummary = document.createElement('div');
    medalSummary.setAttribute('data-stage-clear-medals', '');
    medalSummary.style.cssText = `
      position: relative;
      z-index: 1;
      display: flex;
      align-items: stretch;
      justify-content: center;
      gap: 0.65rem;
      flex-wrap: wrap;
      margin-top: 0.55rem;
    `;

    const currentMedal = createStageMedalDisplay(stageNumber, starCount, {
      label: 'こんかい',
      hint: `⭐ ${starCount}`,
      size: 'hero',
      scope: 'stage-clear-current',
    });
    currentMedal.style.minWidth = '136px';
    currentMedal.style.padding = '0.65rem 0.8rem';
    currentMedal.style.borderRadius = '20px';
    currentMedal.style.background = 'rgba(255, 255, 255, 0.12)';

    const bestMedal = createStageMedalDisplay(stageNumber, bestStarCount, {
      label: 'ベスト',
      hint: `⭐ ${bestStarCount}`,
      size: 'hero',
      scope: 'stage-clear-best',
    });
    bestMedal.style.minWidth = '136px';
    bestMedal.style.padding = '0.65rem 0.8rem';
    bestMedal.style.borderRadius = '20px';
    bestMedal.style.background = 'rgba(255, 255, 255, 0.12)';

    medalSummary.append(currentMedal, bestMedal);
    return medalSummary;
  }

  private createNextAdventureCard(nextEntry: PlanetEncyclopediaEntry): HTMLElement {
    const nextAdventureCard = document.createElement('section');
    nextAdventureCard.setAttribute('data-stage-clear-next-preview', '');
    nextAdventureCard.style.cssText = `
      margin-top: 0.8rem;
      width: min(88vw, 400px);
      padding: 0.8rem 0.95rem 0.95rem;
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(30, 46, 112, 0.92), rgba(12, 22, 66, 0.96));
      border: 2px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.26);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.45rem;
    `;

    const nextAdventureLabel = this.createHeading('つぎのぼうけん', `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: #b9d7ff;
      letter-spacing: 0.08em;
    `);
    const nextAdventureTitle = this.createHeading(`つぎは ${nextEntry.reading}！`, `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.25rem, 4.6vmin, 1.7rem);
      font-weight: 900;
      color: #fff4a3;
      text-shadow: 0 0 14px rgba(255, 230, 120, 0.25);
    `);
    nextAdventureTitle.setAttribute('data-stage-clear-next-title', '');

    const nextAdventureEmoji = document.createElement('div');
    nextAdventureEmoji.textContent = nextEntry.emoji;
    nextAdventureEmoji.setAttribute('data-stage-clear-next-emoji', '');
    nextAdventureEmoji.style.cssText = `
      font-size: clamp(2.6rem, 11vmin, 3.9rem);
      line-height: 1;
      filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.24));
    `;

    const nextAdventureName = this.createHeading(nextEntry.reading, `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.2rem, 4.2vmin, 1.55rem);
      font-weight: 800;
      color: #ffffff;
    `);
    nextAdventureName.setAttribute('data-stage-clear-next-name', '');

    const nextAdventureTrivia = this.createHeading(nextEntry.trivia, `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.4vmin, 1.05rem);
      font-weight: 700;
      color: #dfeaff;
      line-height: 1.35;
    `);
    nextAdventureTrivia.setAttribute('data-stage-clear-next-trivia', '');

    nextAdventureCard.append(
      nextAdventureLabel,
      nextAdventureTitle,
      nextAdventureEmoji,
      nextAdventureName,
      nextAdventureTrivia,
    );
    return nextAdventureCard;
  }

  private createActionButtons(options: StageClearOverlayShowOptions): HTMLDivElement {
    const hasRewardButton = Boolean(options.rewardEntry && options.onReward);
    const actionButtons = document.createElement('div');
    actionButtons.setAttribute('data-stage-clear-actions', '');
    actionButtons.style.cssText = `
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: repeat(${hasRewardButton ? 3 : 2}, minmax(0, 1fr));
      align-items: stretch;
      justify-content: center;
      gap: clamp(0.4rem, 1.8vmin, 0.7rem);
      width: min(100%, ${hasRewardButton ? '42rem' : '30rem'});
      margin-top: 0.7rem;
    `;

    if (hasRewardButton) {
      actionButtons.appendChild(this.createRewardButton(options));
    }

    const retryButton = document.createElement('button');
    retryButton.setAttribute('data-stage-clear-retry', '');
    retryButton.setAttribute('aria-label', 'もういちど');
    retryButton.textContent = 'もういちど';
    retryButton.disabled = true;
    retryButton.style.cssText = `
      width: 100%;
      min-width: 0;
      min-height: 58px;
      padding: 0.65rem 0.7rem;
      border: none;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.4vmin, 1.24rem);
      font-weight: 900;
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.26);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      touch-action: manipulation;
      transform: scale(1);
      transition: opacity 0.18s ease-out, transform 0.08s ease-out;
    `;
    retryButton.style.opacity = '0';
    retryButton.style.visibility = 'hidden';
    retryButton.style.pointerEvents = 'none';

    const continueButton = document.createElement('button');
    continueButton.setAttribute('data-stage-clear-continue', '');
    continueButton.setAttribute('aria-label', options.continueLabel);
    continueButton.textContent = options.continueLabel;
    continueButton.disabled = true;
    continueButton.style.cssText = `
      width: 100%;
      min-width: 0;
      min-height: 58px;
      padding: 0.65rem 0.7rem;
      border: none;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 3.6vmin, 1.3rem);
      font-weight: 900;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      touch-action: manipulation;
      transform: scale(1);
      transition: opacity 0.18s ease-out, transform 0.08s ease-out;
    `;
    continueButton.style.opacity = '0';
    continueButton.style.visibility = 'hidden';
    continueButton.style.pointerEvents = 'none';

    this.attachActionHandlers(retryButton, options.onRetry);
    this.attachActionHandlers(continueButton, options.onContinue);
    this.retryButton = retryButton;
    this.continueButton = continueButton;

    actionButtons.append(retryButton, continueButton);
    return actionButtons;
  }

  private createRewardButton(options: StageClearOverlayShowOptions): HTMLButtonElement {
    const rewardButton = document.createElement('button');
    rewardButton.setAttribute('data-stage-clear-card', '');
    rewardButton.textContent = 'カードをみる';
    rewardButton.style.cssText = `
      width: 100%;
      min-width: 0;
      min-height: 58px;
      padding: 0.65rem 0.7rem;
      border: none;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.4vmin, 1.24rem);
      font-weight: 900;
      color: #fff;
      background: rgba(255, 255, 255, 0.18);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out, opacity 0.18s ease-out;
    `;

    this.buttonCleanups.add(attachReleaseConfirmButton(rewardButton, {
      canActivate: () => !this.isRewardOpen,
      onActivate: () => {
        if (this.isRewardOpen) return;
        options.onReward?.();
      },
      onPressChange: (pressed) => {
        rewardButton.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
      },
      preventDefaultOnPointerDown: true,
      preventDefaultOnClick: true,
      stopPropagation: true,
    }));
    this.rewardButton = rewardButton;
    return rewardButton;
  }

  private attachActionHandlers(button: HTMLButtonElement, onActivate: () => void): void {
    const canActivate = (): boolean =>
      !this.isRewardOpen && this.isContinueEnabled && !this.hasHandledContinue;

    const cleanup = attachReleaseConfirmButton(button, {
      canActivate,
      onActivate: () => {
        if (!canActivate()) return;
        this.hasHandledContinue = true;
        for (const actionButton of [this.retryButton, this.continueButton]) {
          if (!actionButton) continue;
          actionButton.disabled = true;
          actionButton.style.pointerEvents = 'none';
          actionButton.style.transform = 'scale(1)';
        }
        onActivate();
      },
      onPressChange: (pressed) => {
        button.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
      },
      preventDefaultOnPointerDown: true,
      preventDefaultOnClick: true,
      stopPropagation: true,
    });
    this.buttonCleanups.add(cleanup);
  }

  private appendClearCelebrationBurst(): void {
    if (!this.overlayEl) return;

    const burstLayer = document.createElement('div');
    burstLayer.setAttribute('data-stage-clear-burst', '');
    burstLayer.style.cssText = `
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    `;

    const burstItems = [
      { emoji: '⭐', x: '0px', y: '-164px', midX: '0px', midY: '-84px', size: '2.6rem', scale: '1.12', delay: '0ms', duration: '1500ms' },
      { emoji: '✨', x: '138px', y: '-108px', midX: '72px', midY: '-56px', size: '2.2rem', scale: '0.96', delay: '90ms', duration: '1440ms' },
      { emoji: '🌟', x: '176px', y: '-10px', midX: '96px', midY: '-8px', size: '2.5rem', scale: '1.04', delay: '150ms', duration: '1520ms' },
      { emoji: '⭐', x: '136px', y: '112px', midX: '74px', midY: '58px', size: '2.3rem', scale: '0.92', delay: '220ms', duration: '1480ms' },
      { emoji: '✨', x: '0px', y: '170px', midX: '0px', midY: '88px', size: '2rem', scale: '0.88', delay: '280ms', duration: '1400ms' },
      { emoji: '🌟', x: '-142px', y: '118px', midX: '-76px', midY: '60px', size: '2.4rem', scale: '1.02', delay: '340ms', duration: '1500ms' },
      { emoji: '⭐', x: '-182px', y: '-8px', midX: '-98px', midY: '-6px', size: '2.6rem', scale: '1.08', delay: '410ms', duration: '1560ms' },
      { emoji: '✨', x: '-126px', y: '-118px', midX: '-68px', midY: '-64px', size: '2.1rem', scale: '0.94', delay: '470ms', duration: '1460ms' },
      { emoji: '🌟', x: '78px', y: '-182px', midX: '40px', midY: '-96px', size: '2rem', scale: '0.86', delay: '520ms', duration: '1380ms' },
    ] as const;

    for (const item of burstItems) {
      const emoji = document.createElement('span');
      emoji.setAttribute('data-stage-clear-burst-emoji', '');
      emoji.setAttribute('aria-hidden', 'true');
      emoji.textContent = item.emoji;
      emoji.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: ${item.size};
        line-height: 1;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.3);
        will-change: transform, opacity;
        animation: stageClearEmojiBurst ${item.duration} ease-out ${item.delay} forwards;
        --stage-clear-burst-mid-x: ${item.midX};
        --stage-clear-burst-mid-y: ${item.midY};
        --stage-clear-burst-x: ${item.x};
        --stage-clear-burst-y: ${item.y};
        --stage-clear-burst-scale: ${item.scale};
      `;
      burstLayer.appendChild(emoji);
    }

    this.overlayEl.appendChild(burstLayer);
  }

  private injectBestStageStarsAnimation(): void {
    if (document.getElementById('best-stage-stars-animation')) return;

    const style = document.createElement('style');
    style.id = 'best-stage-stars-animation';
    style.textContent = `
      @keyframes bestStageStarsPop {
        0%   { transform: scale(0.6); opacity: 0; }
        60%  { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1.0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  private injectStageClearBurstAnimation(): void {
    if (document.getElementById('stage-clear-burst-animation')) return;

    const style = document.createElement('style');
    style.id = 'stage-clear-burst-animation';
    style.textContent = `
      @keyframes stageClearEmojiBurst {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.3);
        }
        22% {
          opacity: 1;
          transform: translate(
            calc(-50% + var(--stage-clear-burst-mid-x)),
            calc(-50% + var(--stage-clear-burst-mid-y))
          ) scale(calc(var(--stage-clear-burst-scale) * 0.82));
        }
        100% {
          opacity: 0;
          transform: translate(
            calc(-50% + var(--stage-clear-burst-x)),
            calc(-50% + var(--stage-clear-burst-y))
          ) scale(var(--stage-clear-burst-scale));
        }
      }
    `;
    document.head.appendChild(style);
  }
}
