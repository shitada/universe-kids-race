export class TutorialOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private static readonly COMPACT_HEIGHT_THRESHOLD = 720;

  show(onClose: () => void): void {
    if (this.overlayEl) return;

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;
    const isCompactHeight = this.isCompactHeight();

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-tutorial-overlay', '');
    this.overlayEl.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: ${isCompactHeight ? 'flex-start' : 'center'};
      background: rgba(0, 0, 32, 0.92);
      pointer-events: auto;
      z-index: 30;
      padding: ${isCompactHeight ? '0.75rem' : '1.25rem'};
      box-sizing: border-box;
    `;

    const content = document.createElement('div');
    content.setAttribute('data-tutorial-content', '');
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
    title.setAttribute('data-tutorial-title', '');
    title.textContent = 'あそびかた';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1.8rem' : '2.2rem'};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${isCompactHeight ? '0.9rem' : '1.5rem'};
      text-align: center;
    `;
    content.appendChild(title);

    // Cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.style.cssText = `
      display: flex;
      gap: ${isCompactHeight ? '0.8rem' : '1.5rem'};
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      max-width: 90%;
    `;

    // Card 1: Movement
    cardsContainer.appendChild(this.createCard(
      '👆',
      'ひだり・みぎ を タッチ',
      'うちゅうせんが うごくよ',
      'swipe 2s ease-in-out infinite',
      isCompactHeight,
    ));

    // Card 2: Boost
    cardsContainer.appendChild(this.createCard(
      '🚀',
      'ブースト ボタン',
      'はやく すすめるよ！',
      'boostPulse 1.5s ease-in-out infinite',
      isCompactHeight,
    ));

    // Card 3: Goal
    cardsContainer.appendChild(this.createCard(
      '⭐',
      'ほしを あつめて',
      'ゴールを めざそう！',
      'starGlow 3s linear infinite',
      isCompactHeight,
    ));

    content.appendChild(cardsContainer);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'とじる';
    closeBtn.style.cssText = `
      margin-top: ${isCompactHeight ? '0.9rem' : '1.5rem'};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1.15rem' : '1.4rem'};
      font-weight: 700;
      padding: ${isCompactHeight ? '0.7rem 2rem' : '0.8rem 2.5rem'};
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #FF6B6B, #FFE66D);
      color: #333;
      cursor: pointer;
      touch-action: manipulation;
      pointer-events: auto;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    `;
    closeBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      onClose();
    });
    content.appendChild(closeBtn);

    // Inject keyframes
    this.injectAnimations();

    this.overlayEl.appendChild(content);
    uiOverlay.appendChild(this.overlayEl);
  }

  hide(): void {
    if (this.overlayEl) {
      this.overlayEl.remove();
      this.overlayEl = null;
    }
  }

  private createCard(
    icon: string,
    titleText: string,
    description: string,
    animation: string,
    isCompactHeight: boolean,
  ): HTMLDivElement {
    const card = document.createElement('div');
    card.setAttribute('data-tutorial-card', '');
    card.style.cssText = `
      background: rgba(255, 255, 255, 0.08);
      border-radius: 1.5rem;
      padding: ${isCompactHeight ? '1rem 0.85rem' : '1.5rem 1.2rem'};
      width: ${isCompactHeight ? '150px' : '180px'};
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    `;

    const iconEl = document.createElement('div');
    iconEl.textContent = icon;
    iconEl.style.cssText = `
      font-size: ${isCompactHeight ? '2rem' : '2.5rem'};
      margin-bottom: ${isCompactHeight ? '0.55rem' : '0.8rem'};
      animation: ${animation};
    `;

    const titleEl = document.createElement('div');
    titleEl.textContent = titleText;
    titleEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '0.95rem' : '1.1rem'};
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
    `;

    const descEl = document.createElement('div');
    descEl.textContent = description;
    descEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '0.8rem' : '0.9rem'};
      color: rgba(255, 255, 255, 0.7);
    `;

    card.appendChild(iconEl);
    card.appendChild(titleEl);
    card.appendChild(descEl);
    return card;
  }

  private isCompactHeight(): boolean {
    return window.innerHeight <= TutorialOverlay.COMPACT_HEIGHT_THRESHOLD;
  }

  private injectAnimations(): void {
    if (document.getElementById('tutorial-animations')) return;

    const style = document.createElement('style');
    style.id = 'tutorial-animations';
    style.textContent = `
      @keyframes swipe {
        0%, 100% { transform: translateX(-20px); }
        50% { transform: translateX(20px); }
      }
      @keyframes boostPulse {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes starGlow {
        0% { transform: rotate(0deg); opacity: 0.7; }
        50% { transform: rotate(180deg); opacity: 1; }
        100% { transform: rotate(360deg); opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
  }
}
