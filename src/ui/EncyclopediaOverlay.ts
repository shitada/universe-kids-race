import type { PlanetEncyclopediaEntry } from '../types';
import { getPlanetEncyclopediaEntry, PLANET_ENCYCLOPEDIA } from '../game/config/PlanetEncyclopedia';
import { createCompanionPreviewController, type CompanionPreviewController } from './CompanionPreview';
import { attachReleaseConfirmButton } from './attachReleaseConfirmButton';
import { createStageMedalDisplay } from './stageMedalDisplay';

interface DetailOverlayOptions {
  bestStageStars?: Record<number, number>;
  backLabel?: string;
  zIndex?: number;
}

interface EncyclopediaOverlayDependencies {
  createPreviewController?: () => CompanionPreviewController;
}

export class EncyclopediaOverlay {
  private static readonly RELEASE_CONFIRM_MOVE_TOLERANCE_PX = 12;
  private static readonly GALLERY_TITLE_ID = 'encyclopedia-gallery-title';
  private static readonly DETAIL_TITLE_ID = 'encyclopedia-detail-title';
  private overlayEl: HTMLDivElement | null = null;
  private detailEl: HTMLDivElement | null = null;
  private isShowingDetail = false;
  private onSelectStage: ((stageNumber: number) => void) | null = null;
  private bestStageStars: Record<number, number> = {};
  private detailBackLabel = 'もどる';
  private detailPreviewController: CompanionPreviewController | null = null;
  private readonly createPreviewController: () => CompanionPreviewController;
  private readonly galleryActionCleanups = new Set<() => void>();
  private readonly detailActionCleanups = new Set<() => void>();
  private static readonly COMPACT_HEIGHT_THRESHOLD = 720;

  constructor(dependencies: EncyclopediaOverlayDependencies = {}) {
    this.createPreviewController = dependencies.createPreviewController ?? createCompanionPreviewController;
  }

  show(
    unlockedPlanets: number[],
    onClose: () => void,
    onSelectStage?: (stageNumber: number) => void,
    bestStageStars?: Record<number, number>,
  ): void {
    if (this.overlayEl) return;
    this.onSelectStage = onSelectStage ?? null;
    this.bestStageStars = bestStageStars ?? {};
    this.detailBackLabel = 'もどる';

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.overlayEl = document.createElement('div');
    this.applyOverlayStyle(this.overlayEl, 30);
    this.overlayEl.setAttribute('role', 'dialog');
    this.overlayEl.setAttribute('aria-modal', 'true');
    this.overlayEl.setAttribute('aria-labelledby', EncyclopediaOverlay.GALLERY_TITLE_ID);
    const isCompactHeight = this.isCompactHeight();

    const content = document.createElement('div');
    content.setAttribute('data-gallery-content', '');
    content.style.cssText = `
      width: min(960px, 100%);
      max-height: calc(100% - ${isCompactHeight ? '0.5rem' : '1rem'});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${isCompactHeight ? '0.75rem 0.35rem 1rem' : '0.5rem'};
      box-sizing: border-box;
    `;

    // Title
    const title = document.createElement('div');
    title.id = EncyclopediaOverlay.GALLERY_TITLE_ID;
    title.textContent = 'わくせいずかん';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1.7rem' : '2rem'};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${isCompactHeight ? '0.9rem' : '1.5rem'};
      text-align: center;
    `;
    content.appendChild(title);

    // Card grid
    const grid = document.createElement('div');
    grid.setAttribute('data-gallery-grid', '');
    grid.setAttribute('aria-label', 'わくせい の いちらん');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${isCompactHeight ? '110px' : '140px'}, 1fr));
      gap: ${isCompactHeight ? '0.7rem' : '1rem'};
      width: min(100%, 820px);
      justify-items: center;
    `;

    for (const entry of PLANET_ENCYCLOPEDIA) {
      const isUnlocked = unlockedPlanets.includes(entry.stageNumber);
      const card = this.createCard(entry, isUnlocked, isCompactHeight);
      grid.appendChild(card);
    }

    content.appendChild(grid);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.setAttribute('data-gallery-back', '');
    backBtn.textContent = 'もどる';
    backBtn.style.cssText = `
      margin-top: ${isCompactHeight ? '0.9rem' : '1.5rem'};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1.15rem' : '1.4rem'};
      font-weight: 700;
      padding: ${isCompactHeight ? '0.55rem 1.6rem' : '0.6rem 2rem'};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `;
    this.galleryActionCleanups.add(attachReleaseConfirmButton(backBtn, {
      onActivate: () => {
        this.hide();
        onClose();
      },
      onPressChange: (pressed) => {
        backBtn.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
      },
      moveTolerancePx: EncyclopediaOverlay.RELEASE_CONFIRM_MOVE_TOLERANCE_PX,
    }));
    content.appendChild(backBtn);

    this.overlayEl.appendChild(content);
    uiOverlay.appendChild(this.overlayEl);
  }

  showStageDetail(stageNumber: number, onClose: () => void, options: DetailOverlayOptions = {}): boolean {
    if (this.overlayEl) return false;
    const entry = getPlanetEncyclopediaEntry(stageNumber);
    if (!entry) return false;

    this.onSelectStage = null;
    this.bestStageStars = options.bestStageStars ?? {};
    this.detailBackLabel = options.backLabel ?? 'もどる';

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return false;

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-encyclopedia-detail-overlay', '');
    this.applyOverlayStyle(this.overlayEl, options.zIndex ?? 30);
    this.overlayEl.setAttribute('role', 'dialog');
    this.overlayEl.setAttribute('aria-modal', 'true');
    this.overlayEl.setAttribute('aria-labelledby', EncyclopediaOverlay.DETAIL_TITLE_ID);
    uiOverlay.appendChild(this.overlayEl);
    this.showDetail(entry, onClose);
    return true;
  }

  private applyOverlayStyle(element: HTMLDivElement, zIndex: number): void {
    element.style.cssText = `
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 32, 0.95);
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: ${this.isCompactHeight() ? 'flex-start' : 'center'};
      padding: ${this.isCompactHeight() ? '0.75rem' : '1.25rem'};
      box-sizing: border-box;
    `;
    element.style.zIndex = String(zIndex);
  }

  hide(): void {
    this.cleanupActionCleanups(this.detailActionCleanups);
    this.cleanupActionCleanups(this.galleryActionCleanups);
    this.hideDetailPreview();
    if (this.detailEl) {
      this.detailEl.remove();
      this.detailEl = null;
    }
    if (this.overlayEl) {
      this.overlayEl.remove();
      this.overlayEl = null;
    }
    this.isShowingDetail = false;
    this.onSelectStage = null;
    this.bestStageStars = {};
    this.detailBackLabel = 'もどる';
    this.disposeDetailPreview();
  }

  private createCard(entry: PlanetEncyclopediaEntry, isUnlocked: boolean, isCompactHeight: boolean): HTMLDivElement {
    const card = document.createElement('div');
    card.setAttribute('data-card', '');
    card.setAttribute('data-stage', String(entry.stageNumber));
    card.style.cssText = `
      min-height: ${isCompactHeight ? '96px' : '120px'};
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: ${isCompactHeight ? '0.65rem' : '0.8rem'};
      width: 100%;
      max-width: ${isCompactHeight ? '150px' : '180px'};
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.12s ease-out;
      transform: scale(1);
      box-sizing: border-box;
    `;

    if (isUnlocked) {
      const colorHex = '#' + entry.planetColor.toString(16).padStart(6, '0');
      card.style.background = `linear-gradient(135deg, ${colorHex}88, ${colorHex}44)`;
      card.style.cursor = 'pointer';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const emoji = document.createElement('div');
      emoji.textContent = entry.emoji;
      emoji.setAttribute('aria-hidden', 'true');
      emoji.style.fontSize = isCompactHeight ? '1.7rem' : '2rem';
      card.appendChild(emoji);

      const name = document.createElement('div');
      name.textContent = entry.encyclopediaLabel;
      name.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.9rem' : '1rem'};
        font-weight: 700;
        color: #fff;
        margin-top: 0.3rem;
      `;
      card.appendChild(name);

      const bestCount = this.bestStageStars[entry.stageNumber] ?? 0;
      card.setAttribute('aria-label', this.getCardAriaLabel(entry, bestCount));
      const medalDisplay = createStageMedalDisplay(entry.stageNumber, bestCount, {
        hint: bestCount > 0 ? `⭐ ベスト ${bestCount}` : undefined,
        size: 'compact',
        scope: 'encyclopedia-card',
      });
      medalDisplay.style.marginTop = '0.35rem';
      card.appendChild(medalDisplay);

      this.galleryActionCleanups.add(attachReleaseConfirmButton(card, {
        onActivate: () => {
          this.showDetail(entry);
        },
        onPressChange: (pressed) => {
          card.style.transform = pressed ? 'scale(0.95)' : 'scale(1)';
        },
        moveTolerancePx: EncyclopediaOverlay.RELEASE_CONFIRM_MOVE_TOLERANCE_PX,
      }));
    } else {
      card.style.background = '#444';
      card.style.opacity = '0.6';
      card.style.pointerEvents = 'none';
      card.setAttribute('aria-disabled', 'true');
      card.setAttribute('aria-label', 'まだ みつけていない わくせい');

      const lock = document.createElement('div');
      lock.textContent = '？？？';
      lock.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '1rem' : '1.2rem'};
        color: #aaa;
        text-align: center;
      `;
      card.appendChild(lock);
    }

    return card;
  }

  private showDetail(entry: PlanetEncyclopediaEntry, onBack?: () => void): void {
    if (this.isShowingDetail) return;
    if (!this.overlayEl) return;
    this.isShowingDetail = true;
    this.cleanupActionCleanups(this.detailActionCleanups);
    const isCompactHeight = this.isCompactHeight();

    this.detailEl = document.createElement('div');
    this.detailEl.setAttribute('data-detail', '');
    this.detailEl.setAttribute('role', 'dialog');
    this.detailEl.setAttribute('aria-modal', 'true');
    this.detailEl.setAttribute('aria-labelledby', EncyclopediaOverlay.DETAIL_TITLE_ID);
    this.detailEl.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: ${isCompactHeight ? 'flex-start' : 'center'};
      background: rgba(0, 0, 32, 0.9);
      z-index: 31;
      padding: ${isCompactHeight ? '0.75rem' : '1.25rem'};
      box-sizing: border-box;
    `;

    const colorHex = '#' + entry.planetColor.toString(16).padStart(6, '0');

    const detailContent = document.createElement('div');
    detailContent.setAttribute('data-detail-content', '');
    detailContent.style.cssText = `
      width: min(460px, 100%);
      max-height: calc(100% - ${isCompactHeight ? '0.5rem' : '1rem'});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${isCompactHeight ? '0.25rem 0.1rem 1rem' : '0.25rem'};
      box-sizing: border-box;
    `;

    const detailCard = document.createElement('div');
    detailCard.setAttribute('data-detail-card', '');
    detailCard.style.cssText = `
      width: min(${isCompactHeight ? '340px' : '400px'}, 100%);
      max-height: calc(100vh - ${isCompactHeight ? '8.5rem' : '10rem'});
      background: linear-gradient(135deg, ${colorHex}88, ${colorHex}44);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${isCompactHeight ? '1.1rem 1rem' : '2rem'};
      overflow-y: auto;
      box-sizing: border-box;
    `;

    const emoji = document.createElement('div');
    emoji.textContent = entry.emoji;
    emoji.setAttribute('aria-hidden', 'true');
    emoji.style.fontSize = isCompactHeight ? '3rem' : '4rem';
    detailCard.appendChild(emoji);

    const name = document.createElement('div');
    name.id = EncyclopediaOverlay.DETAIL_TITLE_ID;
    name.textContent = entry.encyclopediaLabel;
    name.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1.6rem' : '2rem'};
      font-weight: 700;
      color: #FFD700;
      margin: 0.5rem 0;
      text-align: center;
    `;
    detailCard.appendChild(name);

    const companionSection = document.createElement('div');
    companionSection.setAttribute('data-detail-companion', '');
    companionSection.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      margin-top: 0.4rem;
    `;

    const companionLabel = document.createElement('div');
    companionLabel.textContent = 'うちゅうの なかま';
    companionLabel.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '0.9rem' : '1rem'};
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.04em;
    `;
    companionSection.appendChild(companionLabel);

    const companionPreview = document.createElement('div');
    companionPreview.setAttribute('data-detail-companion-preview', '');
    companionPreview.setAttribute('aria-hidden', 'true');
    companionPreview.style.cssText = `
      width: ${isCompactHeight ? '96px' : '120px'};
      height: ${isCompactHeight ? '96px' : '120px'};
      border-radius: 20px;
      overflow: hidden;
      background: radial-gradient(circle at top, rgba(255,255,255,0.22), rgba(0,0,0,0.16));
      box-shadow: inset 0 0 18px rgba(255,255,255,0.12), 0 10px 20px rgba(0,0,0,0.22);
    `;
    companionSection.appendChild(companionPreview);
    this.getDetailPreviewController().show(entry, companionPreview);
    detailCard.appendChild(companionSection);

    const trivia = document.createElement('div');
    trivia.textContent = entry.trivia;
    trivia.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1rem' : '1.2rem'};
      color: #fff;
      line-height: ${isCompactHeight ? '1.65' : '1.8'};
      padding: ${isCompactHeight ? '1rem 0.4rem' : '1.5rem'};
      text-align: center;
    `;
    detailCard.appendChild(trivia);

    const bestCount = this.bestStageStars[entry.stageNumber] ?? 0;
    const medalDisplay = createStageMedalDisplay(entry.stageNumber, bestCount, {
      label: 'メダル',
      hint: bestCount > 0 ? `⭐ ベスト ${bestCount}` : undefined,
      size: 'hero',
      scope: 'encyclopedia-detail',
    });
    medalDisplay.style.marginTop = '0.4rem';
    detailCard.appendChild(medalDisplay);

    if (this.onSelectStage) {
      const playBtn = document.createElement('button');
      playBtn.setAttribute('data-detail-play', '');
      playBtn.textContent = 'このステージで あそぶ';
      playBtn.style.cssText = `
        margin-top: ${isCompactHeight ? '0.8rem' : '1rem'};
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '1.05rem' : '1.2rem'};
        font-weight: 700;
        padding: ${isCompactHeight ? '0.75rem 1.2rem' : '0.8rem 1.6rem'};
        border: none;
        border-radius: 1.5rem;
        background: linear-gradient(135deg, #FF6B6B, #FFE66D);
        color: #333;
        cursor: pointer;
        touch-action: manipulation;
        transform: scale(1);
        transition: transform 0.08s ease-out;
      `;
      this.detailActionCleanups.add(attachReleaseConfirmButton(playBtn, {
        onActivate: () => {
          const cb = this.onSelectStage;
          if (!cb) return;
          const stageNumber = entry.stageNumber;
          this.hide();
          cb(stageNumber);
        },
        onPressChange: (pressed) => {
          playBtn.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
        },
        moveTolerancePx: EncyclopediaOverlay.RELEASE_CONFIRM_MOVE_TOLERANCE_PX,
      }));
      detailCard.appendChild(playBtn);
    }

    detailContent.appendChild(detailCard);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.setAttribute('data-detail-back', '');
    backBtn.textContent = this.detailBackLabel;
    backBtn.style.cssText = `
      margin-top: ${isCompactHeight ? '0.9rem' : '1.5rem'};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1.15rem' : '1.4rem'};
      font-weight: 700;
      padding: ${isCompactHeight ? '0.55rem 1.6rem' : '0.6rem 2rem'};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `;
    this.detailActionCleanups.add(attachReleaseConfirmButton(backBtn, {
      onActivate: () => {
        if (onBack) {
          this.hide();
          onBack();
          return;
        }
        this.hideDetail();
      },
      onPressChange: (pressed) => {
        backBtn.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
      },
      moveTolerancePx: EncyclopediaOverlay.RELEASE_CONFIRM_MOVE_TOLERANCE_PX,
    }));
    detailContent.appendChild(backBtn);

    this.detailEl.appendChild(detailContent);
    this.overlayEl.appendChild(this.detailEl);
  }

  private hideDetail(): void {
    this.cleanupActionCleanups(this.detailActionCleanups);
    this.hideDetailPreview();
    if (this.detailEl) {
      this.detailEl.remove();
      this.detailEl = null;
    }
    this.isShowingDetail = false;
  }

  private getDetailPreviewController(): CompanionPreviewController {
    if (!this.detailPreviewController) {
      this.detailPreviewController = this.createPreviewController();
    }
    return this.detailPreviewController;
  }

  private hideDetailPreview(): void {
    this.detailPreviewController?.hide();
  }

  private disposeDetailPreview(): void {
    this.detailPreviewController?.dispose();
    this.detailPreviewController = null;
  }

  private cleanupActionCleanups(cleanups: Set<() => void>): void {
    for (const cleanup of cleanups) {
      cleanup();
    }
    cleanups.clear();
  }

  private isCompactHeight(): boolean {
    return window.innerHeight <= EncyclopediaOverlay.COMPACT_HEIGHT_THRESHOLD;
  }

  private getCardAriaLabel(entry: PlanetEncyclopediaEntry, bestCount: number): string {
    const parts = [`${entry.encyclopediaLabel}`];
    if (bestCount > 0) {
      parts.push(`ベスト ほし ${bestCount}こ`);
    }
    parts.push('くわしく みる');
    return parts.join('、');
  }
}
