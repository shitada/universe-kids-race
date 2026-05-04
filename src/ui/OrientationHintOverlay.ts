/**
 * OrientationHintOverlay
 *
 * 端末を縦向きで起動／回転したときに表示する「よこむきにしてね」案内
 * オーバーレイ。横向きに戻ったら hide() で消える。
 *
 * Constitution:
 *  I.  子供ファースト: ひらがな + 絵文字、シンプルな一文。
 *  II. デザイン: TutorialOverlay / ResumeOverlay と同じ Zen Maru Gothic /
 *               角丸カード / 濃紺グラデ + 星の装飾。
 *  III.シンプル操作: タップ不要。回転すれば自動的に消える。
 *  IV. 3D 冒険体験: DOM オーバーレイのみ。毎フレーム処理ゼロ。
 *  V.  技術スタック: TypeScript / DOM のみ。外部ライブラリ追加なし。
 *  VI. 独立モジュール: TDD で扱える単独クラス。
 *
 * 使い方:
 *   const overlay = new OrientationHintOverlay();
 *   overlay.show();
 *   overlay.hide();
 *   overlay.dispose();
 */
export class OrientationHintOverlay {
  private overlayEl: HTMLDivElement | null = null;

  /**
   * オーバーレイを表示する。既に表示中なら何もしない（多重 DOM を防止）。
   */
  show(): void {
    if (this.overlayEl) return;

    const uiOverlay = document.getElementById('ui-overlay') ?? document.body;

    const overlay = document.createElement('div');
    overlay.setAttribute('data-orientation-hint-overlay', '');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-label', 'よこむきにしてね');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 50;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    `;
    // Set background separately: jsdom's CSS parser drops the entire
    // declaration block if it encounters multi-gradient shorthand it can't
    // parse, which would silently strip pointer-events / z-index above.
    overlay.style.background = [
      'radial-gradient(circle at 20% 25%, rgba(255,255,255,0.18) 0 2px, transparent 3px)',
      'radial-gradient(circle at 70% 18%, rgba(255,255,255,0.14) 0 2px, transparent 3px)',
      'radial-gradient(circle at 35% 75%, rgba(255,255,255,0.12) 0 2px, transparent 3px)',
      'radial-gradient(circle at 82% 70%, rgba(255,255,255,0.16) 0 2px, transparent 3px)',
      'linear-gradient(160deg, rgba(8, 14, 50, 0.97), rgba(20, 30, 80, 0.97))',
    ].join(', ');

    const card = document.createElement('div');
    card.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-weight: 900;
      color: #fff;
      background: rgba(20, 30, 70, 0.92);
      border-radius: 32px;
      padding: clamp(24px, 5vw, 44px) clamp(28px, 6vw, 60px);
      text-align: center;
      box-shadow:
        0 0 36px rgba(120, 180, 255, 0.5),
        0 8px 28px rgba(0, 0, 0, 0.55);
      max-width: 80%;
    `;
    card.innerHTML = `
      <div data-orientation-hint-icon
           style="font-size: clamp(56px, 14vw, 120px); line-height: 1.1;
                  display: inline-block;
                  animation: orientation-hint-rotate 2.4s ease-in-out infinite;
                  transform-origin: 50% 50%;">📱</div>
      <div style="font-size: clamp(28px, 5.5vw, 56px); margin-top: 12px;">
        よこむきにしてね
      </div>
      <div style="font-size: clamp(18px, 3vw, 28px); margin-top: 14px; opacity: 0.85;">
        ➡️ よこ にすると あそべるよ ✨
      </div>
    `;

    this.ensureKeyframes();

    overlay.appendChild(card);
    uiOverlay.appendChild(overlay);
    this.overlayEl = overlay;
  }

  /** オーバーレイを撤去する。表示中でなくても安全。 */
  hide(): void {
    this.overlayEl?.remove();
    this.overlayEl = null;
  }

  /** リソース解放。複数回呼んでも安全。 */
  dispose(): void {
    this.hide();
  }

  /** テスト用: 現在表示中か。 */
  isVisible(): boolean {
    return this.overlayEl !== null;
  }

  private ensureKeyframes(): void {
    const id = 'orientation-hint-overlay-keyframes';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes orientation-hint-rotate {
        0%   { transform: rotate(0deg); }
        45%  { transform: rotate(-90deg); }
        55%  { transform: rotate(-90deg); }
        100% { transform: rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  }
}
