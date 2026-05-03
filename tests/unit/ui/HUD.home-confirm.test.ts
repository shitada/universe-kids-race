// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HUD } from '../../../src/ui/HUD';

describe('HUD ↔ HomeConfirmOverlay 連携', () => {
  let hud: HUD;

  beforeEach(() => {
    const hudRoot = document.createElement('div');
    hudRoot.id = 'hud';
    document.body.appendChild(hudRoot);

    const uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);

    hud = new HUD();
  });

  afterEach(() => {
    hud.hide();
    document.getElementById('hud')?.remove();
    document.getElementById('ui-overlay')?.remove();
  });

  const getHomeBtn = (): HTMLButtonElement =>
    document.getElementById('hud')!.querySelector('button') as HTMLButtonElement;

  it('🏠 ボタンタップで onHomeCallback が即発火しない', () => {
    const cb = vi.fn();
    hud.show('テスト');
    hud.setHomeCallback(cb);
    getHomeBtn().dispatchEvent(new Event('pointerdown'));
    expect(cb).not.toHaveBeenCalled();
  });

  it('🏠 ボタンタップで HomeConfirmOverlay が表示される', () => {
    hud.show('テスト');
    hud.setHomeCallback(() => {});
    expect(document.querySelector('[data-home-confirm-overlay]')).toBeNull();
    getHomeBtn().dispatchEvent(new Event('pointerdown'));
    expect(document.querySelector('[data-home-confirm-overlay]')).not.toBeNull();
  });

  it('🏠 ボタンタップで確認表示開始通知が 1 回だけ発火する', () => {
    const onOpen = vi.fn();
    hud.show('テスト');
    hud.setHomeCallback(() => {});
    hud.setHomeConfirmOpenCallback(onOpen);

    const btn = getHomeBtn();
    btn.dispatchEvent(new Event('pointerdown'));
    btn.dispatchEvent(new Event('pointerdown'));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('オーバーレイの「🏠 タイトルへ もどる」で onHomeCallback が発火する', () => {
    const cb = vi.fn();
    hud.show('テスト');
    hud.setHomeCallback(cb);
    getHomeBtn().dispatchEvent(new Event('pointerdown'));
    const backBtn = document.querySelector<HTMLButtonElement>(
      '[data-home-confirm-back]',
    )!;
    backBtn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    backBtn.dispatchEvent(new Event('pointerup', { bubbles: true }));
    expect(cb).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-home-confirm-overlay]')).toBeNull();
  });

  it('オーバーレイの「✋ つづける」で onHomeCallback は発火せずオーバーレイのみ閉じる', () => {
    const cb = vi.fn();
    const onCancel = vi.fn();
    hud.show('テスト');
    hud.setHomeCallback(cb);
    hud.setHomeConfirmCancelCallback(onCancel);
    getHomeBtn().dispatchEvent(new Event('pointerdown'));
    const continueBtn = document.querySelector<HTMLButtonElement>(
      '[data-home-confirm-continue]',
    )!;
    continueBtn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    continueBtn.dispatchEvent(new Event('pointerup', { bubbles: true }));
    expect(cb).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-home-confirm-overlay]')).toBeNull();
  });

  it('🏠 を連打しても確認オーバーレイは 1 つだけ表示される (二重表示防止)', () => {
    hud.show('テスト');
    hud.setHomeCallback(() => {});
    const btn = getHomeBtn();
    btn.dispatchEvent(new Event('pointerdown'));
    btn.dispatchEvent(new Event('pointerdown'));
    btn.dispatchEvent(new Event('pointerdown'));
    expect(
      document.querySelectorAll('[data-home-confirm-overlay]').length,
    ).toBe(1);
  });

  it('hide() で確認オーバーレイも確実にクリーンアップされる', () => {
    hud.show('テスト');
    hud.setHomeCallback(() => {});
    getHomeBtn().dispatchEvent(new Event('pointerdown'));
    expect(document.querySelector('[data-home-confirm-overlay]')).not.toBeNull();
    hud.hide();
    expect(document.querySelector('[data-home-confirm-overlay]')).toBeNull();
  });
});
