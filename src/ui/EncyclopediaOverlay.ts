import type { PlanetEncyclopediaEntry } from '../types';
import { PLANET_ENCYCLOPEDIA } from '../game/config/PlanetEncyclopedia';

export class EncyclopediaOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private detailEl: HTMLDivElement | null = null;
  private isShowingDetail = false;
  private onSelectStage: ((stageNumber: number) => void) | null = null;

  show(
    unlockedPlanets: number[],
    onClose: () => void,
    onSelectStage?: (stageNumber: number) => void,
  ): void {
    if (this.overlayEl) return;
    this.onSelectStage = onSelectStage ?? null;

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.overlayEl = document.createElement('div');
    this.overlayEl.style.cssText = `
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 32, 0.95);
      pointer-events: auto;
      z-index: 30;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `;

    // Title
    const title = document.createElement('div');
    title.textContent = 'わくせいずかん';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
    `;
    this.overlayEl.appendChild(title);

    // Card grid
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      max-width: 90%;
      justify-items: center;
    `;

    for (const entry of PLANET_ENCYCLOPEDIA) {
      const isUnlocked = unlockedPlanets.includes(entry.stageNumber);
      const card = this.createCard(entry, isUnlocked);
      grid.appendChild(card);
    }

    this.overlayEl.appendChild(grid);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.setAttribute('data-gallery-back', '');
    backBtn.textContent = 'もどる';
    backBtn.style.cssText = `
      margin-top: 1.5rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      padding: 0.6rem 2rem;
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
    `;
    backBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.hide();
      onClose();
    });
    this.overlayEl.appendChild(backBtn);

    uiOverlay.appendChild(this.overlayEl);
  }

  hide(): void {
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
  }

  private createCard(entry: PlanetEncyclopediaEntry, isUnlocked: boolean): HTMLDivElement {
    const card = document.createElement('div');
    card.setAttribute('data-card', '');
    card.setAttribute('data-stage', String(entry.stageNumber));
    card.style.cssText = `
      min-height: 120px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.8rem;
      width: 100%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.12s ease-out;
    `;

    if (isUnlocked) {
      const colorHex = '#' + entry.planetColor.toString(16).padStart(6, '0');
      card.style.background = `linear-gradient(135deg, ${colorHex}88, ${colorHex}44)`;
      card.style.cursor = 'pointer';

      const emoji = document.createElement('div');
      emoji.textContent = entry.emoji;
      emoji.style.fontSize = '2rem';
      card.appendChild(emoji);

      const name = document.createElement('div');
      name.textContent = entry.name;
      name.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        color: #fff;
        margin-top: 0.3rem;
      `;
      card.appendChild(name);

      card.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        card.style.transform = 'scale(0.95)';
        if (this.onSelectStage) {
          const cb = this.onSelectStage;
          const stageNumber = entry.stageNumber;
          this.hide();
          cb(stageNumber);
        } else {
          this.showDetail(entry);
        }
      });
      const resetScale = () => {
        card.style.transform = '';
      };
      card.addEventListener('pointerup', resetScale);
      card.addEventListener('pointerleave', resetScale);
      card.addEventListener('pointercancel', resetScale);
    } else {
      card.style.background = '#444';
      card.style.opacity = '0.6';
      card.style.pointerEvents = 'none';

      const lock = document.createElement('div');
      lock.textContent = '？？？';
      lock.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 1.2rem;
        color: #aaa;
        text-align: center;
      `;
      card.appendChild(lock);
    }

    return card;
  }

  private showDetail(entry: PlanetEncyclopediaEntry): void {
    if (this.isShowingDetail) return;
    if (!this.overlayEl) return;
    this.isShowingDetail = true;

    this.detailEl = document.createElement('div');
    this.detailEl.setAttribute('data-detail', '');
    this.detailEl.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 32, 0.9);
      z-index: 31;
    `;

    const colorHex = '#' + entry.planetColor.toString(16).padStart(6, '0');

    const detailCard = document.createElement('div');
    detailCard.style.cssText = `
      max-width: 400px;
      max-height: 500px;
      background: linear-gradient(135deg, ${colorHex}88, ${colorHex}44);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    `;

    const emoji = document.createElement('div');
    emoji.textContent = entry.emoji;
    emoji.style.fontSize = '4rem';
    detailCard.appendChild(emoji);

    const name = document.createElement('div');
    name.textContent = entry.name;
    name.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: #FFD700;
      margin: 0.5rem 0;
    `;
    detailCard.appendChild(name);

    const trivia = document.createElement('div');
    trivia.textContent = entry.trivia;
    trivia.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.2rem;
      color: #fff;
      line-height: 1.8;
      padding: 1.5rem;
      text-align: center;
    `;
    detailCard.appendChild(trivia);

    this.detailEl.appendChild(detailCard);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.setAttribute('data-detail-back', '');
    backBtn.textContent = 'もどる';
    backBtn.style.cssText = `
      margin-top: 1.5rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      padding: 0.6rem 2rem;
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
    `;
    backBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.hideDetail();
    });
    this.detailEl.appendChild(backBtn);

    this.overlayEl.appendChild(this.detailEl);
  }

  private hideDetail(): void {
    if (this.detailEl) {
      this.detailEl.remove();
      this.detailEl = null;
    }
    this.isShowingDetail = false;
  }
}
