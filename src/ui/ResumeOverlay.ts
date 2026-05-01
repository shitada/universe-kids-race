/**
 * ResumeOverlay
 *
 * バックグラウンドから戻ったとき、ステージプレイ中のみ表示する
 * 「またあそぼう！ ▶」タップ復帰オーバーレイ。
 *
 * Constitution:
 *  I. 子供ファースト: 戻ってきた瞬間に敗北しているのを防ぐ。ひらがな + 絵文字。
 *  II. デザイン: CountdownOverlay / TutorialOverlay と同じ Zen Maru Gothic /
 *               角丸カード / 濃紺背景。
 *  III. シンプル操作: 単一タップのみ。新ジェスチャ無し。
 *  IV. 3D 冒険体験: DOM オーバーレイのみ。毎フレーム処理ゼロ。
 *  V. 技術スタック: TypeScript / DOM のみ。外部ライブラリ追加なし。
 *  VI. 独立モジュール: TDD で扱える単独クラス。
 *
 * 使い方:
 *   const overlay = new ResumeOverlay();
 *   overlay.show(() => {
 *     gameLoop.resume();
 *     audioManager.ensureResumed();
 *     stageScene.requestResumeCountdown();
 *   });
 *   // 後始末
 *   overlay.dispose();
 */
export class ResumeOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private cardEl: HTMLDivElement | null = null;
  private onResume: (() => void) | null = null;
  private tapListener: ((event: Event) => void) | null = null;

  /**
   * オーバーレイを表示する。タップされると `onResume` を呼んでから DOM を撤去。
   * 既に表示中なら多重表示せず、`onResume` のみ最新値に差し替える
   * （複数の visibility イベントが連続発火しても安全）。
   */
  show(onResume: () => void): void {
    this.onResume = onResume;
    if (this.overlayEl) return;

    const uiOverlay = document.getElementById('ui-overlay') ?? document.body;

    const overlay = document.createElement('div');
    overlay.setAttribute('data-resume-overlay', '');
    overlay.setAttribute('role', 'button');
    overlay.setAttribute('aria-label', 'タップしてあそぶ');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(8, 14, 40, 0.78);
      pointer-events: auto;
      z-index: 30;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    `;

    const card = document.createElement('div');
    card.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-weight: 900;
      color: #fff;
      background: rgba(20, 30, 70, 0.92);
      border-radius: 28px;
      padding: clamp(20px, 4vw, 36px) clamp(28px, 6vw, 56px);
      text-align: center;
      box-shadow:
        0 0 32px rgba(120, 180, 255, 0.45),
        0 8px 24px rgba(0, 0, 0, 0.5);
      transform: scale(0.92);
      animation: resume-overlay-pop 320ms ease-out forwards;
      will-change: transform, opacity;
    `;
    card.innerHTML = `
      <div style="font-size: clamp(40px, 8vw, 88px); line-height: 1.1;">🚀</div>
      <div style="font-size: clamp(28px, 5.2vw, 56px); margin-top: 8px;">またあそぼう！</div>
      <div style="font-size: clamp(18px, 3vw, 28px); margin-top: 14px; opacity: 0.85;">タップしてはじめる ▶</div>
    `;

    this.ensureKeyframes();

    overlay.appendChild(card);
    uiOverlay.appendChild(overlay);

    const handleTap = (event: Event): void => {
      event.preventDefault();
      this.handleResume();
    };
    overlay.addEventListener('pointerdown', handleTap);
    overlay.addEventListener('click', handleTap);

    this.overlayEl = overlay;
    this.cardEl = card;
    this.tapListener = handleTap;
  }

  /**
   * 表示を強制終了する。`onResume` は呼ばれない。
   */
  hide(): void {
    if (this.overlayEl && this.tapListener) {
      this.overlayEl.removeEventListener('pointerdown', this.tapListener);
      this.overlayEl.removeEventListener('click', this.tapListener);
    }
    this.overlayEl?.remove();
    this.overlayEl = null;
    this.cardEl = null;
    this.tapListener = null;
    this.onResume = null;
  }

  /** リソース解放。複数回呼んでも安全。 */
  dispose(): void {
    this.hide();
  }

  /** テスト用: 現在表示中か。 */
  isVisible(): boolean {
    return this.overlayEl !== null;
  }

  private handleResume(): void {
    const cb = this.onResume;
    this.hide();
    if (cb) {
      try {
        cb();
      } catch {
        /* ignore */
      }
    }
  }

  private ensureKeyframes(): void {
    const id = 'resume-overlay-keyframes';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes resume-overlay-pop {
        0%   { transform: scale(0.7); opacity: 0; }
        60%  { transform: scale(1.06); opacity: 1; }
        100% { transform: scale(1.0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}
