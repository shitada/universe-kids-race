// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LoadingOverlay } from '../../../src/ui/LoadingOverlay';

describe('LoadingOverlay', () => {
  let overlay: LoadingOverlay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new LoadingOverlay();
  });

  afterEach(() => {
    overlay.hide();
    document.body.innerHTML = '';
  });

  it('show() renders animated space icons with the loading message', () => {
    overlay.show('タイトルの じゅんび ちゅう...');

    const root = document.querySelector<HTMLElement>('[data-loading-overlay]');
    expect(root).not.toBeNull();
    expect(root?.getAttribute('role')).toBe('status');
    expect(root?.getAttribute('aria-live')).toBe('polite');
    expect(root?.querySelector('[data-loading-card]')).not.toBeNull();
    expect(root?.querySelector('[data-loading-icons]')).not.toBeNull();
    expect(root?.querySelector('[data-loading-icon="star"]')?.textContent).toBe('⭐');
    expect(root?.querySelector('[data-loading-icon="planet"]')?.textContent).toBe('🪐');
    expect(root?.querySelector('[data-loading-message]')?.textContent).toBe('タイトルの じゅんび ちゅう...');
  });

  it('hide() removes overlay markup from the DOM', () => {
    overlay.show('ずかんを よんでるよ...');

    overlay.hide();

    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(document.querySelector('[data-loading-card]')).toBeNull();
  });

  it('can be shown again with a new message after hide()', () => {
    overlay.show('ゲームの じゅんび ちゅう...');
    overlay.hide();

    overlay.show('ずかんを よんでるよ...');

    expect(document.querySelectorAll('[data-loading-overlay]')).toHaveLength(1);
    expect(document.querySelector('[data-loading-message]')?.textContent).toBe('ずかんを よんでるよ...');
  });
});
