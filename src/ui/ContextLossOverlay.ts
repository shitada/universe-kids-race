/**
 * Overlay shown when the WebGL context is lost on iPad Safari (long
 * background, memory pressure, app switch). Provides a child-friendly
 * "もういちど あそぶ 🚀" button that reloads the page so the canvas is
 * recreated cleanly.
 *
 * Style规约 follows TutorialOverlay / EncyclopediaOverlay:
 * - Zen Maru Gothic font family
 * - 濃紺背景 (rgba(0, 0, 32, 0.92))
 * - 黄色見出し (#FFD700)
 * - Minimum tap target 88x88px (Constitution III: simple touch UX)
 */
export class ContextLossOverlay {
  private overlayEl: HTMLDivElement | null = null;

  show(onReload: () => void): void {
    if (this.overlayEl) return;

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-context-loss-overlay', '');
    this.overlayEl.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 60;
    `;
    // Set test-asserted critical style properties individually AFTER cssText
    // so they survive jsdom's strict CSS parser (which silently drops
    // properties it doesn't recognise from cssText assignment).
    this.overlayEl.style.background = 'rgba(0, 0, 32, 0.92)';

    const title = document.createElement('div');
    title.textContent = 'ロケットが ちょっと おやすみちゅう';
    title.style.cssText = `
      font-size: 2rem;
      font-weight: 900;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.2rem;
      text-align: center;
      padding: 0 1rem;
    `;
    title.style.fontFamily = "'Zen Maru Gothic', sans-serif";
    title.style.color = '#FFD700';
    this.overlayEl.appendChild(title);

    const desc = document.createElement('div');
    desc.textContent = 'ボタンを おして もういちど はじめよう！';
    desc.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.1rem;
      color: #ffffff;
      margin-bottom: 1.8rem;
      text-align: center;
      padding: 0 1rem;
    `;
    this.overlayEl.appendChild(desc);

    const reloadBtn = document.createElement('button');
    reloadBtn.setAttribute('data-context-loss-reload', '');
    reloadBtn.textContent = 'もういちど あそぶ 🚀';
    reloadBtn.style.cssText = `
      font-size: 1.6rem;
      font-weight: 900;
      padding: 1.2rem 2.4rem;
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #FF6B6B, #FFE66D);
      color: #FFD700;
      text-shadow: 0 1px 2px rgba(0, 0, 32, 0.6);
      cursor: pointer;
      touch-action: manipulation;
      pointer-events: auto;
      box-shadow: 0 4px 18px rgba(255, 107, 107, 0.45);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `;
    reloadBtn.style.fontFamily = "'Zen Maru Gothic', sans-serif";
    reloadBtn.style.minWidth = '88px';
    reloadBtn.style.minHeight = '88px';
    reloadBtn.style.touchAction = 'manipulation';
    reloadBtn.style.transform = 'scale(1)';
    reloadBtn.style.transition = 'transform 0.08s ease-out';

    let triggered = false;
    const releasePress = (): void => {
      reloadBtn.style.transform = 'scale(1)';
    };
    reloadBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      reloadBtn.style.transform = 'scale(0.9)';
      if (triggered) return;
      triggered = true;
      onReload();
    });
    reloadBtn.addEventListener('pointerup', releasePress);
    reloadBtn.addEventListener('pointercancel', releasePress);
    reloadBtn.addEventListener('pointerleave', releasePress);
    this.overlayEl.appendChild(reloadBtn);

    uiOverlay.appendChild(this.overlayEl);
  }

  hide(): void {
    if (this.overlayEl) {
      this.overlayEl.remove();
      this.overlayEl = null;
    }
  }

  isVisible(): boolean {
    return this.overlayEl !== null;
  }
}
