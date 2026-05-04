export interface LoadFailureAction {
  label: string;
  onSelect: () => void | Promise<void>;
}

export interface LoadFailureOverlayOptions {
  title?: string;
  message?: string;
  primaryAction: LoadFailureAction;
  secondaryAction?: LoadFailureAction;
}

export class LoadFailureOverlay {
  private element: HTMLDivElement | null = null;

  show(options: LoadFailureOverlayOptions): void {
    this.hide();

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    const titleText = options.title ?? 'ちょっと じゅんびに しっぱいしたよ';
    const messageText = options.message ?? 'ボタンを おして もういちど ためそう！';
    let isHandlingAction = false;
    const buttons: HTMLButtonElement[] = [];

    this.element = document.createElement('div');
    this.element.setAttribute('data-load-failure-overlay', '');
    const compact = window.innerHeight <= 500;
    this.element.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 32, 0.88);
      pointer-events: auto;
      z-index: 50;
      padding: ${compact ? '0.8rem' : '1.5rem'};
    `;

    const card = document.createElement('div');
    card.style.cssText = `
      width: min(460px, 100%);
      border-radius: ${compact ? '1.2rem' : '1.75rem'};
      background: rgba(255, 255, 255, 0.16);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
      padding: ${compact ? '0.8rem' : '1.5rem'};
      text-align: center;
    `;

    const title = document.createElement('div');
    title.textContent = titleText;
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${compact ? '1.3rem' : '1.9rem'};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
      margin-bottom: ${compact ? '0.4rem' : '0.8rem'};
    `;

    const message = document.createElement('div');
    message.textContent = messageText;
    message.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${compact ? '0.9rem' : '1.1rem'};
      font-weight: 700;
      color: #fff;
      line-height: 1.6;
      margin-bottom: ${compact ? '0.6rem' : '1.2rem'};
    `;

    const buttonRow = document.createElement('div');
    buttonRow.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      align-items: stretch;
    `;

    const createButton = (
      action: LoadFailureAction,
      dataAttribute: string,
      background: string,
      color: string,
    ): HTMLButtonElement => {
      const button = document.createElement('button');
      button.setAttribute(dataAttribute, '');
      button.textContent = action.label;
      button.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${compact ? '1.1rem' : '1.4rem'};
        font-weight: 900;
        min-height: ${compact ? '52px' : '88px'};
        width: 100%;
        border: none;
        border-radius: 1.5rem;
        background: ${background};
        color: ${color};
        cursor: pointer;
        touch-action: manipulation;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
      `;

      button.addEventListener('pointerdown', (event) => {
        event.stopPropagation();
        if (isHandlingAction) {
          return;
        }
        isHandlingAction = true;
        buttons.forEach((target) => {
          target.disabled = true;
          target.style.opacity = '0.7';
        });
        this.hide();
        void Promise.resolve(action.onSelect()).catch((error: unknown) => {
          console.error('Load failure action failed', error);
        });
      });

      buttons.push(button);
      return button;
    };

    buttonRow.appendChild(
      createButton(
        options.primaryAction,
        'data-load-failure-primary',
        'linear-gradient(135deg, #FF6B6B, #FFE66D)',
        '#333',
      ),
    );

    if (options.secondaryAction) {
      buttonRow.appendChild(
        createButton(
          options.secondaryAction,
          'data-load-failure-secondary',
          'rgba(255, 255, 255, 0.14)',
          '#fff',
        ),
      );
    }

    card.appendChild(title);
    card.appendChild(message);
    card.appendChild(buttonRow);
    this.element.appendChild(card);
    uiOverlay.appendChild(this.element);
  }

  hide(): void {
    if (!this.element) {
      return;
    }
    this.element.remove();
    this.element = null;
  }

  isVisible(): boolean {
    return this.element !== null;
  }
}
