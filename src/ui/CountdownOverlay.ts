/**
 * CountdownOverlay
 *
 * ステージ開始時に「3 → 2 → 1 → スタート！」のカウントダウンを表示し、
 * 子どもが心構えしてから操作を始められるようにする DOM オーバーレイ。
 *
 * Constitution:
 *  I. 子供ファースト: ポジティブな期待感のみを伝える。
 *  II. デザイン: HUD と同じ Zen Maru Gothic / 角丸 / 柔らかいシャドウ。
 *  III. シンプル操作: 操作は追加せず、カウント中は入力ガード（呼び出し側で実施）。
 *  IV. 3D 冒険体験: DOM オーバーレイで描画ループに干渉しない（transform/opacity のみ）。
 *  V. 技術スタック: TypeScript / DOM のみ。外部ライブラリ追加なし。
 *  VI. 独立モジュール: TDD で扱いやすい単独クラス。
 *
 * 使い方:
 *   const overlay = new CountdownOverlay();
 *   overlay.show(() => {
 *     // start gameplay
 *   });
 *   // 毎フレーム
 *   overlay.tick(deltaTime);
 *   // クリーンアップ
 *   overlay.dispose();
 */
export type CountdownTickHandler = () => void;
export type CountdownGoHandler = () => void;

export interface CountdownOptions {
  /** 各カウント (3,2,1) の表示時間 (秒)。デフォルト 1.0。 */
  stepDuration?: number;
  /** 「スタート！」表示時間 (秒)。デフォルト 0.4。 */
  goDuration?: number;
  /** 各カウント (3,2,1) で呼ばれる効果音ハンドラ。 */
  onTick?: CountdownTickHandler;
  /** 「スタート！」表示時に呼ばれる効果音ハンドラ。 */
  onGo?: CountdownGoHandler;
}

const DEFAULT_STEP_DURATION = 1.0;
const DEFAULT_GO_DURATION = 0.4;

type CountdownPhase = 'idle' | 'counting' | 'go' | 'done';

export class CountdownOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private numberEl: HTMLDivElement | null = null;
  private phase: CountdownPhase = 'idle';
  private elapsed = 0;
  private currentStep = 0; // 0 = "3", 1 = "2", 2 = "1"
  private readonly stepDuration: number;
  private readonly goDuration: number;
  private onTick?: CountdownTickHandler;
  private onGo?: CountdownGoHandler;
  private onComplete: (() => void) | null = null;
  private readonly steps = ['3', '2', '1'];

  constructor(options: CountdownOptions = {}) {
    this.stepDuration = options.stepDuration ?? DEFAULT_STEP_DURATION;
    this.goDuration = options.goDuration ?? DEFAULT_GO_DURATION;
    this.onTick = options.onTick;
    this.onGo = options.onGo;
  }

  /**
   * カウントダウン開始。`onComplete` は「スタート！」表示後に呼ばれる。
   * 既に表示中の場合は何もしない。
   */
  show(onComplete: () => void): void {
    if (this.phase !== 'idle' && this.phase !== 'done') return;

    const uiOverlay = document.getElementById('ui-overlay') ?? document.body;

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-countdown-overlay', '');
    this.overlayEl.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 25;
    `;

    this.numberEl = document.createElement('div');
    this.numberEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-weight: 900;
      font-size: clamp(96px, 18vw, 220px);
      color: #fff;
      text-shadow:
        0 0 24px rgba(255, 215, 0, 0.85),
        0 0 48px rgba(120, 180, 255, 0.6);
      transform: scale(0.6);
      opacity: 0;
      will-change: transform, opacity;
    `;
    this.overlayEl.appendChild(this.numberEl);
    uiOverlay.appendChild(this.overlayEl);

    this.phase = 'counting';
    this.elapsed = 0;
    this.currentStep = 0;
    this.onComplete = onComplete;

    this.renderStep(this.steps[this.currentStep]);
    this.fireTick();
  }

  /**
   * 親シーンの update から deltaTime を渡して進行させる。
   * GameLoop が pause 中は呼ばれず、復帰時に自然に続く。
   */
  tick(deltaTime: number): void {
    if (this.phase === 'idle' || this.phase === 'done') return;
    if (deltaTime < 0) deltaTime = 0;
    this.elapsed += deltaTime;

    if (this.phase === 'counting') {
      const stepElapsed = this.elapsed;
      // ポップイン → 拡大 → フェードアウトを transform/opacity のみで表現
      this.applyStepAnimation(stepElapsed / this.stepDuration);

      if (stepElapsed >= this.stepDuration) {
        this.currentStep++;
        this.elapsed = 0;
        if (this.currentStep < this.steps.length) {
          this.renderStep(this.steps[this.currentStep]);
          this.fireTick();
        } else {
          this.phase = 'go';
          this.renderStep('スタート！');
          this.fireGo();
        }
      }
      return;
    }

    if (this.phase === 'go') {
      this.applyStepAnimation(this.elapsed / this.goDuration);
      if (this.elapsed >= this.goDuration) {
        this.complete();
      }
    }
  }

  /**
   * カウントダウンを強制終了し DOM を片付ける。onComplete は呼ばない。
   */
  hide(): void {
    if (this.overlayEl) {
      this.overlayEl.remove();
      this.overlayEl = null;
    }
    this.numberEl = null;
    this.phase = 'done';
    this.onComplete = null;
  }

  /**
   * 全リソース解放（DOM 撤去）。複数回呼んでも安全。
   */
  dispose(): void {
    this.hide();
    this.onTick = undefined;
    this.onGo = undefined;
  }

  /** テスト用: 現在のフェーズを返す。 */
  isActive(): boolean {
    return this.phase === 'counting' || this.phase === 'go';
  }

  /** テスト用: 現在表示中のラベル。 */
  getCurrentLabel(): string | null {
    return this.numberEl?.textContent ?? null;
  }

  private renderStep(label: string): void {
    if (!this.numberEl) return;
    this.numberEl.textContent = label;
    this.numberEl.style.opacity = '0';
    this.numberEl.style.transform = 'scale(0.6)';
  }

  private applyStepAnimation(progress: number): void {
    if (!this.numberEl) return;
    const p = Math.max(0, Math.min(1, progress));
    // ポップイン (0..0.2) → ホールド (0.2..0.7) → フェードアウト (0.7..1)
    let scale: number;
    let opacity: number;
    if (p < 0.2) {
      const t = p / 0.2;
      scale = 0.6 + t * 0.5; // 0.6 → 1.1
      opacity = t;
    } else if (p < 0.7) {
      const t = (p - 0.2) / 0.5;
      scale = 1.1 - t * 0.1; // 1.1 → 1.0
      opacity = 1;
    } else {
      const t = (p - 0.7) / 0.3;
      scale = 1.0 + t * 0.2; // 1.0 → 1.2
      opacity = 1 - t;
    }
    this.numberEl.style.transform = `scale(${scale.toFixed(3)})`;
    this.numberEl.style.opacity = opacity.toFixed(3);
  }

  private fireTick(): void {
    try {
      this.onTick?.();
    } catch {
      /* ignore */
    }
  }

  private fireGo(): void {
    try {
      this.onGo?.();
    } catch {
      /* ignore */
    }
  }

  private complete(): void {
    const cb = this.onComplete;
    this.hide();
    if (cb) {
      try {
        cb();
      } catch {
        /* ignore */
      }
    }
  }
}
