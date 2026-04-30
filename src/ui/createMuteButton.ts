export interface MuteButtonOptions {
  initialMuted: boolean;
  onToggle: () => void;
  container: HTMLElement;
  topRem?: number;
}

export interface MuteButtonHandle {
  element: HTMLButtonElement;
  setMuted(muted: boolean): void;
  remove(): void;
}

/**
 * 共通のミュートトグルボタンを生成して `container` に追加する。
 *
 * StageScene の HUD と TitleScene / EndingScene のオーバーレイで同じデザインを
 * 流用するためのファクトリ。位置・配色・font は HUD のホームボタン (🏠) と
 * 揃えてあるため、画面遷移後もユーザーから見て一貫した見た目になる。
 */
export function createMuteButton(opts: MuteButtonOptions): MuteButtonHandle {
  const topRem = opts.topRem ?? 0.8;
  const button = document.createElement('button');
  let muted = opts.initialMuted;

  const applyState = (): void => {
    button.textContent = muted ? '🔇' : '🔊';
    button.setAttribute('aria-label', muted ? 'サウンド オフ' : 'サウンド オン');
  };

  button.setAttribute('data-mute-button', '');
  button.style.position = 'absolute';
  button.style.top = `${topRem}rem`;
  button.style.right = 'max(1rem, calc(env(safe-area-inset-right, 0px) + 0.5rem))';
  button.style.fontSize = 'clamp(1.4rem, 4vmin, 1.8rem)';
  button.style.background = 'rgba(255, 255, 255, 0.15)';
  button.style.border = 'none';
  button.style.borderRadius = '50%';
  button.style.width = '3rem';
  button.style.height = '3rem';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.cursor = 'pointer';
  button.style.pointerEvents = 'auto';
  button.style.touchAction = 'manipulation';
  button.style.transform = 'scale(1)';
  button.style.transition = 'transform 0.08s ease-out';
  applyState();

  const releasePress = (): void => {
    button.style.transform = 'scale(1)';
  };

  button.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    button.style.transform = 'scale(0.9)';
    opts.onToggle();
  });
  button.addEventListener('pointerup', releasePress);
  button.addEventListener('pointercancel', releasePress);
  button.addEventListener('pointerleave', releasePress);

  opts.container.appendChild(button);

  return {
    element: button,
    setMuted(next: boolean): void {
      muted = next;
      applyState();
    },
    remove(): void {
      button.remove();
    },
  };
}
