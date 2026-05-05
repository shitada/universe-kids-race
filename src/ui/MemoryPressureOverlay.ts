export interface MemoryPressureOverlayOptions {
  onReload: () => void;
}

export class MemoryPressureOverlay {
  private overlayEl: HTMLDivElement | null = null;

  show(options: MemoryPressureOverlayOptions): void {
    if (this.overlayEl) {
      return;
    }

    const uiOverlay = document.getElementById('ui-overlay') ?? document.body;
    const overlay = document.createElement('div');
    overlay.setAttribute('data-memory-pressure-overlay', '');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 32, 0.9);
      padding: 1rem;
      pointer-events: auto;
      z-index: 70;
    `;

    const card = document.createElement('div');
    card.style.cssText = `
      width: min(480px, 100%);
      border-radius: 2rem;
      background: rgba(20, 30, 70, 0.94);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
      padding: 1.4rem 1.2rem 1.3rem;
      text-align: center;
      font-family: 'Zen Maru Gothic', sans-serif;
      color: #fff;
    `;

    const emoji = document.createElement('div');
    emoji.textContent = '⭐';
    emoji.setAttribute('aria-hidden', 'true');
    emoji.style.cssText = 'font-size: 3rem; line-height: 1;';

    const title = document.createElement('div');
    title.textContent = 'ちょっと やすもう';
    title.style.cssText = `
      margin-top: 0.7rem;
      font-size: 2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.35);
    `;

    const body = document.createElement('div');
    body.textContent = 'ロケットを かるく してるよ。あたらしく はじめると あんしんだよ。';
    body.style.cssText = `
      margin-top: 0.8rem;
      font-size: 1.05rem;
      line-height: 1.7;
      font-weight: 700;
    `;

    const button = document.createElement('button');
    button.setAttribute('data-memory-pressure-reload', '');
    button.textContent = 'あたらしく はじめよう';
    button.style.cssText = `
      margin-top: 1.2rem;
      width: 100%;
      border: none;
      border-radius: 1.6rem;
      background: linear-gradient(135deg, #FF6B6B, #FFE66D);
      color: #24304a;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.25rem;
      font-weight: 900;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.35);
    `;
    button.style.minWidth = '88px';
    button.style.minHeight = '88px';

    let triggered = false;
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (triggered) {
        return;
      }
      triggered = true;
      options.onReload();
    });

    card.append(emoji, title, body, button);
    overlay.appendChild(card);
    uiOverlay.appendChild(overlay);
    this.overlayEl = overlay;
  }

  hide(): void {
    this.overlayEl?.remove();
    this.overlayEl = null;
  }

  dispose(): void {
    this.hide();
  }

  isVisible(): boolean {
    return this.overlayEl !== null;
  }
}
