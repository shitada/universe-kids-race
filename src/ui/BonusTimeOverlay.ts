import type { BonusTimeOverlayState, BonusTimeResultState } from '../types';

export class BonusTimeOverlay {
  private root: HTMLDivElement | null = null;
  private remainingEl: HTMLDivElement | null = null;
  private countEl: HTMLDivElement | null = null;
  private messageEl: HTMLDivElement | null = null;
  private resultEl: HTMLDivElement | null = null;

  show(state: BonusTimeOverlayState): void {
    this.hide();

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) {
      return;
    }

    const root = document.createElement('div');
    root.setAttribute('data-bonus-time-overlay', '');
    root.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 1rem;
      pointer-events: none;
      z-index: 45;
      box-sizing: border-box;
    `;

    const card = document.createElement('section');
    card.style.cssText = `
      width: min(92vw, 560px);
      display: grid;
      gap: 0.45rem;
      padding: 0.95rem 1.1rem;
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(39, 55, 132, 0.95), rgba(12, 20, 68, 0.96));
      border: 2px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 16px 34px rgba(0, 0, 0, 0.24);
      text-align: center;
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
    `;

    const title = document.createElement('div');
    title.textContent = '🌟 ボーナスタイム';
    title.style.cssText = `
      font-size: clamp(1.35rem, 4.5vmin, 1.8rem);
      font-weight: 900;
      color: #fff1a8;
    `;

    const statsRow = document.createElement('div');
    statsRow.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.6rem;
    `;

    this.remainingEl = document.createElement('div');
    this.remainingEl.setAttribute('data-bonus-time-remaining', '');
    this.remainingEl.style.cssText = `
      padding: 0.55rem 0.75rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.12);
      font-size: clamp(1rem, 3.8vmin, 1.2rem);
      font-weight: 800;
    `;

    this.countEl = document.createElement('div');
    this.countEl.setAttribute('data-bonus-time-count', '');
    this.countEl.style.cssText = this.remainingEl.style.cssText;

    this.messageEl = document.createElement('div');
    this.messageEl.setAttribute('data-bonus-time-message', '');
    this.messageEl.style.cssText = `
      min-height: 1.6em;
      font-size: clamp(1rem, 3.6vmin, 1.25rem);
      font-weight: 800;
      color: #fff7bf;
    `;

    this.resultEl = document.createElement('div');
    this.resultEl.setAttribute('data-bonus-time-result', '');
    this.resultEl.style.cssText = `
      display: none;
      padding: 0.65rem 0.8rem;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.12);
      font-size: clamp(1rem, 3.6vmin, 1.2rem);
      font-weight: 900;
      color: #ffe17a;
    `;

    statsRow.append(this.remainingEl, this.countEl);
    card.append(title, statsRow, this.messageEl, this.resultEl);
    root.appendChild(card);
    uiOverlay.appendChild(root);

    this.root = root;
    this.update(state);
  }

  update(state: BonusTimeOverlayState): void {
    if (!this.root || !this.remainingEl || !this.countEl || !this.messageEl) {
      return;
    }

    this.remainingEl.textContent = `あと ${Math.max(0, Math.ceil(state.remainingSeconds))}びょう`;
    this.countEl.textContent = `あつめた ほし ${Math.max(0, Math.floor(state.collectedStars))}こ`;
    this.messageEl.textContent = state.message;
  }

  showResult(result: BonusTimeResultState): void {
    if (!this.root || !this.resultEl) {
      return;
    }

    this.resultEl.style.display = 'block';
    this.resultEl.textContent = result.message;
    this.update({
      remainingSeconds: 0,
      collectedStars: result.collectedStars,
      message: 'キラキラ はなび！',
    });
  }

  hide(): void {
    this.root?.remove();
    this.root = null;
    this.remainingEl = null;
    this.countEl = null;
    this.messageEl = null;
    this.resultEl = null;
  }
}
