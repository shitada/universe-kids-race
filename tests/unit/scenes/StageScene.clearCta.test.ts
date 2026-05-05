// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { TOTAL_STAGES } from '../../../src/game/config/StageConfig';
import { getNextPlanetEncyclopediaEntry } from '../../../src/game/config/PlanetEncyclopedia';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { SaveData } from '../../../src/types';
import { EncyclopediaOverlay } from '../../../src/ui/EncyclopediaOverlay';

interface CreatedScene {
  scene: StageScene;
  sceneManager: { requestTransition: ReturnType<typeof vi.fn> };
  finalizeStageMock: ReturnType<typeof vi.fn>;
}

interface StageSceneInternals {
  scoreSystem: {
    getStarCount(): number;
    getTotalScore(): number;
    getTotalStarCount(): number;
    finalizeStage(): { totalScore: number; totalStarCount: number };
  };
  onStageClear(): void;
  update(deltaTime: number): void;
}

function createScene(options?: {
  stageNumber?: number;
  totalScore?: number;
  totalStarCount?: number;
  launchSource?: 'campaign' | 'encyclopedia';
  saveData?: Partial<SaveData>;
  isNewPlanetUnlock?: boolean;
  earnedStars?: number;
  finalizeStageResult?: { totalScore: number; totalStarCount: number };
  loadEncyclopediaOverlay?: () => Promise<{ EncyclopediaOverlay: typeof EncyclopediaOverlay }>;
}): CreatedScene {
  const stageNumber = options?.stageNumber ?? 1;
  const totalScore = options?.totalScore ?? 0;
  const totalStarCount = options?.totalStarCount ?? 0;
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
    {
      loadEncyclopediaOverlay: options?.loadEncyclopediaOverlay ?? (async () => ({ EncyclopediaOverlay })),
    },
  );
  scene.enter({
    stageNumber,
    totalScore: options?.totalScore,
    totalStarCount: options?.totalStarCount,
    launchSource: options?.launchSource,
    replayToken: 1,
  });

  const internal = scene as unknown as StageSceneInternals;
  const finalizeStageMock = vi.fn(() => finalizeStageResult);
  internal.scoreSystem = {
    getStarCount: () => earnedStars,
    getTotalScore: () => totalScore,
    getTotalStarCount: () => totalStarCount,
    finalizeStage: finalizeStageMock,
  };

  return { scene, sceneManager, finalizeStageMock };
}

function getContinueButton(): HTMLButtonElement {
  const button = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');
  expect(button).not.toBeNull();
  return button!;
}

function getRetryButton(): HTMLButtonElement {
  const button = document.querySelector<HTMLButtonElement>('[data-stage-clear-retry]');
  expect(button).not.toBeNull();
  return button!;
}

function getCardButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('[data-stage-clear-card]');
}

function getNextPreviewCard(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-stage-clear-next-preview]');
}

function dispatchReleaseConfirm(button: HTMLElement): void {
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  button.dispatchEvent(new Event('pointerup', { bubbles: true }));
}

function dispatchReleaseOutside(button: HTMLElement): void {
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  document.body.dispatchEvent(new Event('pointerup', { bubbles: true }));
}

function finishBonusSequence(scene: { update(deltaTime: number): void }): void {
  scene.update(13);
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

function flushPromises(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

function createDeferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
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

    const retryButton = getRetryButton();
    const continueButton = getContinueButton();
    expect(retryButton.disabled).toBe(true);
    expect(continueButton.disabled).toBe(true);

    dispatchReleaseConfirm(retryButton);
    internal.update(30);

    expect(sceneManager.requestTransition).not.toHaveBeenCalled();
    expect(retryButton.disabled).toBe(false);
    expect(continueButton.disabled).toBe(false);
  });

  it('通常ステージではCTAタップで次ステージへ1回だけ進む', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: 4,
      finalizeStageResult: { totalScore: 2400, totalStarCount: 14 },
    });
    const internal = scene as unknown as StageSceneInternals & {
      wormholeTunnelEffect: { isActive(): boolean };
    };

    internal.onStageClear();
    finishBonusSequence(internal);

    const button = getContinueButton();
    expect(button.textContent).toBe('つぎへ');

    dispatchReleaseConfirm(button);
    button.dispatchEvent(new Event('click', { bubbles: true }));

    expect(internal.wormholeTunnelEffect.isActive()).toBe(true);
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    internal.update(2.3);

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 5,
      totalScore: 2400,
      totalStarCount: 14,
    });
  });

  it('通常ステージでは同じボタン上で離した時だけつぎへ進む', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: 4,
      finalizeStageResult: { totalScore: 2400, totalStarCount: 14 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    finishBonusSequence(internal);

    const button = getContinueButton();
    dispatchReleaseOutside(button);

    expect(sceneManager.requestTransition).not.toHaveBeenCalled();
  });

  it('ずかん起動ステージではCTAをタイトルへにし、つぎのぼうけんを表示しない', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: 4,
      launchSource: 'encyclopedia',
      finalizeStageResult: { totalScore: 2400, totalStarCount: 14 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    finishBonusSequence(internal);

    const button = getContinueButton();
    expect(button.textContent).toBe('タイトルへ');
    expect(button.getAttribute('aria-label')).toBe('タイトルへ');
    expect(getNextPreviewCard()).toBeNull();
    expect(document.querySelector('[data-stage-clear-next-title]')).toBeNull();

    dispatchReleaseConfirm(button);

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('title');
  });

  it('通常ステージではつぎのわくせいプレビューを表示する', () => {
    const stageNumber = 4;
    const { scene } = createScene({ stageNumber });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    finishBonusSequence(internal);

    const nextEntry = getNextPlanetEncyclopediaEntry(stageNumber);
    expect(nextEntry).toBeDefined();

    const previewCard = getNextPreviewCard();
    expect(previewCard).not.toBeNull();
    expect(previewCard?.textContent).toContain('つぎのぼうけん');
    expect(document.querySelector('[data-stage-clear-next-title]')?.textContent).toBe(`つぎは ${nextEntry?.reading}！`);
    expect(document.querySelector('[data-stage-clear-next-emoji]')?.textContent).toBe(nextEntry?.emoji);
    expect(document.querySelector('[data-stage-clear-next-name]')?.textContent).toBe(nextEntry?.reading);
    expect(document.querySelector('[data-stage-clear-next-trivia]')?.textContent).toBe(nextEntry?.trivia);
  });

  it('クリア画面にもういちどボタンを表示し、同じステージへ再挑戦できる', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: 4,
      finalizeStageResult: { totalScore: 2400, totalStarCount: 14 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    finishBonusSequence(internal);

    const retryButton = getRetryButton();
    expect(retryButton.textContent).toBe('もういちど');
    expect(retryButton.disabled).toBe(false);

    dispatchReleaseConfirm(retryButton);
    retryButton.dispatchEvent(new Event('click', { bubbles: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 4,
      totalScore: 0,
      totalStarCount: 0,
      replayToken: expect.any(Number),
    });
  });

  it('ずかん起動ステージのもういちどは起動元を引き継ぐ', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: 4,
      launchSource: 'encyclopedia',
      totalScore: 1200,
      totalStarCount: 7,
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    finishBonusSequence(internal);

    const retryButton = getRetryButton();
    dispatchReleaseConfirm(retryButton);

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 4,
      totalScore: 1200,
      totalStarCount: 7,
      launchSource: 'encyclopedia',
      replayToken: expect.any(Number),
    });
  });

  it('最終ステージではCTAタップでendingへ進む', () => {
    const { scene, sceneManager } = createScene({
      stageNumber: TOTAL_STAGES,
      finalizeStageResult: { totalScore: 9000, totalStarCount: 72 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    finishBonusSequence(internal);

    const button = getContinueButton();
    expect(button.textContent).toBe('おいわいへ');
    expect(getNextPreviewCard()).toBeNull();
    dispatchReleaseConfirm(button);

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
    finishBonusSequence(internal);

    const retryButton = getRetryButton();
    expect(retryButton.textContent).toBe('もういちど');

    dispatchReleaseConfirm(retryButton);
    retryButton.dispatchEvent(new Event('click', { bubbles: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 4,
      totalScore: 1200,
      totalStarCount: 7,
      replayToken: expect.any(Number),
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
    finishBonusSequence(internal);

    const retryButton = getRetryButton();
    dispatchReleaseConfirm(retryButton);

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: TOTAL_STAGES,
      totalScore: 8800,
      totalStarCount: 70,
      replayToken: expect.any(Number),
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
    finishBonusSequence(internal);

    const overlay = document.querySelector<HTMLElement>('[data-stage-clear-overlay]');
    expect(overlay).not.toBeNull();
    expect(overlay?.textContent).toContain('じこベストこうしん');
    expect(overlay?.textContent).toContain('ずかんカード ゲット');
    expect(overlay?.textContent).toContain('なかまに なったよ');
    expect(overlay?.textContent).toContain('つぎのぼうけん');

    const actions = document.querySelector('[data-stage-clear-actions]') as HTMLElement | null;
    expect(actions?.style.display).toBe('grid');
    expect(actions?.style.gridTemplateColumns).toContain('repeat(3');
    const button = getContinueButton();
    const retryButton = getRetryButton();
    expect(retryButton.textContent).toBe('もういちど');
    expect(retryButton.disabled).toBe(false);
    expect(button.textContent).toBe('つぎへ');
    expect(button.disabled).toBe(false);
    expect(getCardButton()?.textContent).toBe('カードをみる');
  });

  it('もういちどで同じステージへ再入場し、累計値を二重加算しない', () => {
    const { scene, sceneManager, finalizeStageMock } = createScene({
      stageNumber: 4,
      totalScore: 1800,
      totalStarCount: 11,
      finalizeStageResult: { totalScore: 2400, totalStarCount: 14 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    finishBonusSequence(internal);

    const retryButton = getRetryButton();
    dispatchReleaseConfirm(retryButton);

    expect(finalizeStageMock).not.toHaveBeenCalled();
    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 4,
      totalScore: 1800,
      totalStarCount: 11,
      replayToken: expect.any(Number),
    });
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

  it('通常のステージ開始と通常クリアではカードoverlay loaderを呼ばない', () => {
    const loadEncyclopediaOverlay = vi.fn(async () => ({ EncyclopediaOverlay }));
    const { scene } = createScene({
      stageNumber: 2,
      isNewPlanetUnlock: false,
      loadEncyclopediaOverlay,
    });
    const internal = scene as unknown as StageSceneInternals;

    expect(loadEncyclopediaOverlay).not.toHaveBeenCalled();

    internal.onStageClear();

    expect(loadEncyclopediaOverlay).not.toHaveBeenCalled();
  });

  it('新規アンロック時のみカードoverlay loaderを先読みする', async () => {
    const loadEncyclopediaOverlay = vi.fn(async () => ({ EncyclopediaOverlay }));
    const { scene } = createScene({
      stageNumber: 2,
      isNewPlanetUnlock: true,
      loadEncyclopediaOverlay,
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(1);

    await flushPromises();

    dispatchReleaseConfirm(getCardButton()!);
    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(1);
  });

  it('カード詳細を閉じるとクリア画面へ戻り、その後つぎへできる', async () => {
    const { scene, sceneManager } = createScene({
      stageNumber: 2,
      totalScore: 1500,
      totalStarCount: 7,
      earnedStars: 5,
      isNewPlanetUnlock: true,
      finalizeStageResult: { totalScore: 2000, totalStarCount: 9 },
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();
    finishBonusSequence(internal);

    const cardButton = getCardButton();
    expect(cardButton).not.toBeNull();
    dispatchReleaseConfirm(cardButton!);
    await flushPromises();
    await flushPromises();

    const detailOverlay = document.querySelector('[data-encyclopedia-detail-overlay]') as HTMLElement | null;
    expect(detailOverlay).not.toBeNull();
    expect(detailOverlay?.textContent).toContain('水星（すいせい）');
    expect(detailOverlay?.textContent).toContain('⚫');
    expect(detailOverlay?.textContent).toContain('すいせいは たいように いちばん ちかい わくせいだよ');
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    const continueButton = getContinueButton();
    dispatchReleaseConfirm(continueButton);
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();
    const retryButton = getRetryButton();
    dispatchReleaseConfirm(retryButton);
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    const backButton = document.querySelector('[data-detail-back]') as HTMLElement | null;
    expect(backButton?.textContent).toBe('クリアへ もどる');
    backButton && dispatchReleaseConfirm(backButton);

    expect(document.querySelector('[data-encyclopedia-detail-overlay]')).toBeNull();
    expect(document.querySelector('[data-stage-clear-overlay]')).not.toBeNull();

    dispatchReleaseConfirm(continueButton);
    internal.update(2.3);
    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 3,
      totalScore: 2000,
      totalStarCount: 9,
    });
  });

  it('非同期解決後にカード詳細を開く', async () => {
    const deferred = createDeferred<{ EncyclopediaOverlay: typeof EncyclopediaOverlay }>();
    const loadEncyclopediaOverlay = vi.fn(() => deferred.promise);
    const { scene } = createScene({
      stageNumber: 2,
      earnedStars: 5,
      isNewPlanetUnlock: true,
      loadEncyclopediaOverlay,
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();

    const cardButton = getCardButton();
    expect(cardButton).not.toBeNull();
    dispatchReleaseConfirm(cardButton!);

    expect(document.querySelector('[data-encyclopedia-detail-overlay]')).toBeNull();
    expect(cardButton?.style.pointerEvents).toBe('none');

    deferred.resolve({ EncyclopediaOverlay });
    await flushPromises();
    await flushPromises();

    expect(document.querySelector('[data-encyclopedia-detail-overlay]')).not.toBeNull();
    expect(cardButton?.style.pointerEvents).toBe('none');
  });

  it('load失敗時にカードボタンが再操作可能へ戻る', async () => {
    const loadEncyclopediaOverlay = vi
      .fn<() => Promise<{ EncyclopediaOverlay: typeof EncyclopediaOverlay }>>()
      .mockRejectedValueOnce(new Error('chunk load failed'))
      .mockResolvedValueOnce({ EncyclopediaOverlay });
    const { scene } = createScene({
      stageNumber: 2,
      earnedStars: 5,
      isNewPlanetUnlock: true,
      loadEncyclopediaOverlay,
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();

    const cardButton = getCardButton();
    expect(cardButton).not.toBeNull();
    dispatchReleaseConfirm(cardButton!);
    await flushPromises();
    await flushPromises();

    expect(document.querySelector('[data-encyclopedia-detail-overlay]')).toBeNull();
    expect(cardButton?.style.pointerEvents).toBe('auto');
    expect(cardButton?.style.transform).toBe('scale(1)');

    dispatchReleaseConfirm(cardButton!);
    await flushPromises();
    await flushPromises();

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(2);
    expect(document.querySelector('[data-encyclopedia-detail-overlay]')).not.toBeNull();
  });

  it('scene.exit()後にPromiseが解決してもカード詳細を開かない', async () => {
    const deferred = createDeferred<{ EncyclopediaOverlay: typeof EncyclopediaOverlay }>();
    const loadEncyclopediaOverlay = vi.fn(() => deferred.promise);
    const { scene } = createScene({
      stageNumber: 2,
      earnedStars: 5,
      isNewPlanetUnlock: true,
      loadEncyclopediaOverlay,
    });
    const internal = scene as unknown as StageSceneInternals;

    internal.onStageClear();

    const cardButton = getCardButton();
    expect(cardButton).not.toBeNull();
    dispatchReleaseConfirm(cardButton!);

    scene.exit();
    deferred.resolve({ EncyclopediaOverlay });
    await flushPromises();
    await flushPromises();

    expect(document.querySelector('[data-encyclopedia-detail-overlay]')).toBeNull();
    expect(document.querySelector('[data-stage-clear-overlay]')).toBeNull();
  });

  it('カード詳細表示中や連打時にもういちど遷移が重複しない', async () => {
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
    finishBonusSequence(internal);

    const retryButton = getRetryButton();
    const cardButton = getCardButton();
    expect(cardButton).not.toBeNull();

    dispatchReleaseConfirm(cardButton!);
    await flushPromises();
    await flushPromises();
    dispatchReleaseConfirm(retryButton);
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    const backButton = document.querySelector('[data-detail-back]') as HTMLElement | null;
    backButton && dispatchReleaseConfirm(backButton);

    dispatchReleaseConfirm(retryButton);
    retryButton.dispatchEvent(new Event('click', { bubbles: true }));
    dispatchReleaseConfirm(retryButton);

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 2,
      totalScore: 500,
      totalStarCount: 4,
      replayToken: expect.any(Number),
    });
  });
});
