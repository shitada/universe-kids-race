// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { TOTAL_STAGES } from '../../../src/game/config/StageConfig';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { SaveData } from '../../../src/types';

interface CreatedScene {
  scene: StageScene;
  sceneManager: { requestTransition: ReturnType<typeof vi.fn> };
}

interface StageSceneInternals {
  scoreSystem: {
    getStarCount(): number;
    finalizeStage(): { totalScore: number; totalStarCount: number };
  };
  onStageClear(): void;
  update(deltaTime: number): void;
}

function createScene(options?: {
  stageNumber?: number;
  totalScore?: number;
  totalStarCount?: number;
  saveData?: Partial<SaveData>;
  isNewPlanetUnlock?: boolean;
  earnedStars?: number;
  finalizeStageResult?: { totalScore: number; totalStarCount: number };
}): CreatedScene {
  const stageNumber = options?.stageNumber ?? 1;
  const earnedStars = options?.earnedStars ?? 3;
  const finalizeStageResult = options?.finalizeStageResult ?? { totalScore: 1234, totalStarCount: 8 };
  const sceneManager = { requestTransition: vi.fn() };
  const inputSystem = {
    getState: () => ({ moveDirection: 0, boostPressed: false }),
    setBoostPressed: vi.fn(),
  } as unknown as InputSystem;
  const audioManager = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
  const saveData: SaveData = {
    clearedStage: 0,
    unlockedPlanets: [],
    muted: false,
    bestStageStars: {},
    ...options?.saveData,
  };
  const saveManager = {
    load: vi.fn(() => ({
      ...saveData,
      unlockedPlanets: [...saveData.unlockedPlanets],
      bestStageStars: { ...(saveData.bestStageStars ?? {}) },
    })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => options?.isNewPlanetUnlock ?? false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;
  const scene = new StageScene(
    sceneManager as unknown as SceneManager,
    inputSystem,
    audioManager,
    saveManager,
  );
  scene.enter({
    stageNumber,
    totalScore: options?.totalScore,
    totalStarCount: options?.totalStarCount,
  });

  const internal = scene as unknown as StageSceneInternals;
  internal.scoreSystem = {
    getStarCount: () => earnedStars,
    finalizeStage: () => finalizeStageResult,
  };

  return { scene, sceneManager };
}

function getContinueButton(): HTMLButtonElement {
  const button = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');
  expect(button).not.toBeNull();
  return button!;
}

function getCardButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('[data-stage-clear-card]');
}

function getRetryButton(): HTMLButtonElement {
  const button = document.querySelector<HTMLButtonElement>('[data-stage-clear-retry]');
  expect(button).not.toBeNull();
  return button!;
}

function mockCanvasContext(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
    return {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      fillRect: () => {},
      clearRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      lineTo: () => {},
      ellipse: () => {},
    } as unknown as CanvasRenderingContext2D;
  });
}

describe('StageScene clear CTA', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCanvasContext();
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('CTAを押すまでは自動遷移しない', () => {
    const { scene, sceneManager } = createScene();
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();

    const button = getContinueButton();
    expect(button.disabled).toBe(true);

    button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    internal.update(30);

    expect(sceneManager.requestTransition).not.toHaveBeenCalled();
    expect(button.disabled).toBe(false);
  });

  it('通常ステージではCTAタップで次ステージへ1回だけ進む', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: 4,
      finalizeStageResult: { totalScore: 2400, totalStarCount: 14 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    internal.update(1);

    const button = getContinueButton();
    expect(button.textContent).toBe('つぎへ');

    button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    button.dispatchEvent(new Event('click', { bubbles: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 5,
      totalScore: 2400,
      totalStarCount: 14,
    });
  });

  it('最終ステージではCTAタップでendingへ進む', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: TOTAL_STAGES,
      finalizeStageResult: { totalScore: 9000, totalStarCount: 72 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    internal.update(1);

    const button = getContinueButton();
    expect(button.textContent).toBe('おいわいへ');
    button.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('ending', {
      totalScore: 9000,
      totalStarCount: 72,
    });
  });

  it('クリア画面にもういちどを表示し、同じステージへ開始時点の累計値で戻る', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: 4,
      totalScore: 1200,
      totalStarCount: 7,
      finalizeStageResult: { totalScore: 2400, totalStarCount: 14 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    internal.update(1);

    const retryButton = getRetryButton();
    expect(retryButton.textContent).toBe('もういちど');

    retryButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    retryButton.dispatchEvent(new Event('click', { bubbles: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 4,
      totalScore: 1200,
      totalStarCount: 7,
    });
  });

  it('最終ステージでももういちどはendingではなく同じステージへ戻る', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: TOTAL_STAGES,
      totalScore: 8800,
      totalStarCount: 70,
      finalizeStageResult: { totalScore: 9000, totalStarCount: 72 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    internal.update(1);

    const retryButton = getRetryButton();
    retryButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: TOTAL_STAGES,
      totalScore: 8800,
      totalStarCount: 70,
    });
  });

  it('じこベスト・ずかん・なかま表示とCTAが共存する', () => {
    const { scene } = createScene({
      stageNumber: 2,
      earnedStars: 5,
      isNewPlanetUnlock: true,
      saveData: { bestStageStars: { 2: 2 } },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    internal.update(1);

    const overlay = document.querySelector<HTMLElement>('[data-stage-clear-overlay]');
    expect(overlay).not.toBeNull();
    expect(overlay?.textContent).toContain('じこベストこうしん');
    expect(overlay?.textContent).toContain('ずかんカード ゲット');
    expect(overlay?.textContent).toContain('なかまに なったよ');

    const button = getContinueButton();
    expect(button.textContent).toBe('つぎへ');
    expect(button.disabled).toBe(false);
    expect(getCardButton()?.textContent).toBe('カードをみる');
  });

  it('新規アンロック時だけカードをみるボタンを表示する', () => {
    const unlockedScene = createScene({
      stageNumber: 2,
      isNewPlanetUnlock: true,
    }).scene as unknown as StageSceneInternals;
    unlockedScene.onStageClear();
    expect(getCardButton()).not.toBeNull();

    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    mockCanvasContext();

    const replayScene = createScene({
      stageNumber: 2,
      isNewPlanetUnlock: false,
    }).scene as unknown as StageSceneInternals;
    replayScene.onStageClear();
    expect(getCardButton()).toBeNull();
  });

  it('カード詳細を閉じるとクリア画面へ戻り、その後つぎへできる', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: 2,
      earnedStars: 5,
      isNewPlanetUnlock: true,
      finalizeStageResult: { totalScore: 2000, totalStarCount: 9 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    internal.update(1);

    const cardButton = getCardButton();
    expect(cardButton).not.toBeNull();
    cardButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    const detailOverlay = document.querySelector('[data-encyclopedia-detail-overlay]') as HTMLElement | null;
    expect(detailOverlay).not.toBeNull();
    expect(detailOverlay?.textContent).toContain('水星');
    expect(detailOverlay?.textContent).toContain('⚫');
    expect(detailOverlay?.textContent).toContain('すいせいは たいように いちばん ちかい わくせいだよ');
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    const continueButton = getContinueButton();
    continueButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    const backButton = document.querySelector('[data-detail-back]') as HTMLElement | null;
    expect(backButton?.textContent).toBe('クリアへ もどる');
    backButton?.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(document.querySelector('[data-encyclopedia-detail-overlay]')).toBeNull();
    expect(document.querySelector('[data-stage-clear-overlay]')).not.toBeNull();

    continueButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 3,
      totalScore: 2000,
      totalStarCount: 9,
    });
  });

  it('カード詳細表示中や連打時にもういちど遷移が重複しない', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: 2,
      totalScore: 500,
      totalStarCount: 4,
      earnedStars: 5,
      isNewPlanetUnlock: true,
      finalizeStageResult: { totalScore: 2000, totalStarCount: 9 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    internal.update(1);

    const retryButton = getRetryButton();
    const cardButton = getCardButton();
    expect(cardButton).not.toBeNull();

    cardButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    retryButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    const backButton = document.querySelector('[data-detail-back]') as HTMLElement | null;
    backButton?.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    retryButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    retryButton.dispatchEvent(new Event('click', { bubbles: true }));
    retryButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 2,
      totalScore: 500,
      totalStarCount: 4,
    });
  });
});
