export class TutorialOverlay {
  private overlayEl: HTMLDivElement | null = null;

  show(onClose: () => void): void {
    if (this.overlayEl) return;

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-tutorial-overlay', '');
    this.overlayEl.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 32, 0.92);
      pointer-events: auto;
      z-index: 30;
    `;

    // Title
    const title = document.createElement('div');
    title.textContent = 'あそびかた';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2.2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
    `;
    this.overlayEl.appendChild(title);

    // Cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.style.cssText = `
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 90%;
    `;

    // Card 1: Movement
    cardsContainer.appendChild(this.createCard(
      '👆',
      'ひだり・みぎ を タッチ',
      'うちゅうせんが うごくよ',
      'swipe 2s ease-in-out infinite',
    ));

    // Card 2: Boost
    cardsContainer.appendChild(this.createCard(
      '🚀',
      'ブースト ボタン',
      'はやく すすめるよ！',
      'boostPulse 1.5s ease-in-out infinite',
    ));

    // Card 3: Goal
    cardsContainer.appendChild(this.createCard(
      '⭐',
      'ほしを あつめて',
      'ゴールを めざそう！',
      'starGlow 3s linear infinite',
    ));

    this.overlayEl.appendChild(cardsContainer);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'とじる';
    closeBtn.style.cssText = `
      margin-top: 1.5rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      padding: 0.8rem 2.5rem;
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
    this.overlayEl.appendChild(closeBtn);

    // Inject keyframes
    this.injectAnimations();

    uiOverlay.appendChild(this.overlayEl);
  }

  hide(): void {
    if (this.overlayEl) {
      this.overlayEl.remove();
      this.overlayEl = null;
    }
  }

  private createCard(icon: string, titleText: string, description: string, animation: string): HTMLDivElement {
    const card = document.createElement('div');
    card.setAttribute('data-tutorial-card', '');
    card.style.cssText = `
      background: rgba(255, 255, 255, 0.08);
      border-radius: 1.5rem;
      padding: 1.5rem 1.2rem;
      width: 180px;
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    `;

    const iconEl = document.createElement('div');
    iconEl.textContent = icon;
    iconEl.style.cssText = `
      font-size: 2.5rem;
      margin-bottom: 0.8rem;
      animation: ${animation};
    `;

    const titleEl = document.createElement('div');
    titleEl.textContent = titleText;
    titleEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
    `;

    const descEl = document.createElement('div');
    descEl.textContent = description;
    descEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
    `;

    card.appendChild(iconEl);
    card.appendChild(titleEl);
    card.appendChild(descEl);
    return card;
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
