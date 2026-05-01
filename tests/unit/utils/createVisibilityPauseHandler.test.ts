// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createVisibilityPauseHandler } from '../../../src/game/utils/createVisibilityPauseHandler';

function setHidden(value: boolean): void {
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    get: () => value,
  });
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => (value ? 'hidden' : 'visible'),
  });
}

describe('createVisibilityPauseHandler', () => {
  let dispose: (() => void) | null = null;

  beforeEach(() => {
    setHidden(false);
  });

  afterEach(() => {
    dispose?.();
    dispose = null;
  });

  it('calls onHide when visibilitychange fires while document.hidden=true', () => {
    const onHide = vi.fn();
    const onShow = vi.fn();
    dispose = createVisibilityPauseHandler({ onHide, onShow });

    setHidden(true);
    document.dispatchEvent(new Event('visibilitychange'));

    expect(onHide).toHaveBeenCalledTimes(1);
    expect(onShow).not.toHaveBeenCalled();
  });

  it('calls onShow when visibilitychange fires while document.hidden=false', () => {
    const onHide = vi.fn();
    const onShow = vi.fn();
    dispose = createVisibilityPauseHandler({ onHide, onShow });

    setHidden(false);
    document.dispatchEvent(new Event('visibilitychange'));

    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).not.toHaveBeenCalled();
  });

  it('calls onHide on window.pagehide and window.blur', () => {
    const onHide = vi.fn();
    const onShow = vi.fn();
    dispose = createVisibilityPauseHandler({ onHide, onShow });

    window.dispatchEvent(new Event('pagehide'));
    window.dispatchEvent(new Event('blur'));

    expect(onHide).toHaveBeenCalledTimes(2);
    expect(onShow).not.toHaveBeenCalled();
  });

  it('calls onShow on window.pageshow only when persisted=true (bfcache)', () => {
    const onHide = vi.fn();
    const onShow = vi.fn();
    dispose = createVisibilityPauseHandler({ onHide, onShow });

    // non-bfcache pageshow: no resume
    const e1 = new Event('pageshow') as Event & { persisted?: boolean };
    Object.defineProperty(e1, 'persisted', { value: false });
    window.dispatchEvent(e1);
    expect(onShow).not.toHaveBeenCalled();

    // bfcache restore
    const e2 = new Event('pageshow') as Event & { persisted?: boolean };
    Object.defineProperty(e2, 'persisted', { value: true });
    window.dispatchEvent(e2);
    expect(onShow).toHaveBeenCalledTimes(1);
  });

  it('calls onShow on window.focus', () => {
    const onHide = vi.fn();
    const onShow = vi.fn();
    dispose = createVisibilityPauseHandler({ onHide, onShow });

    window.dispatchEvent(new Event('focus'));

    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).not.toHaveBeenCalled();
  });

  it('teardown removes all listeners', () => {
    const onHide = vi.fn();
    const onShow = vi.fn();
    const teardown = createVisibilityPauseHandler({ onHide, onShow });

    teardown();

    setHidden(true);
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('pagehide'));
    window.dispatchEvent(new Event('blur'));
    window.dispatchEvent(new Event('focus'));
    const e = new Event('pageshow') as Event & { persisted?: boolean };
    Object.defineProperty(e, 'persisted', { value: true });
    window.dispatchEvent(e);

    expect(onHide).not.toHaveBeenCalled();
    expect(onShow).not.toHaveBeenCalled();
  });

  it('honours injected doc/win for full isolation', () => {
    const target = new EventTarget();
    let hidden = false;
    const fakeDoc = {
      addEventListener: target.addEventListener.bind(target),
      removeEventListener: target.removeEventListener.bind(target),
      get hidden() {
        return hidden;
      },
    };
    const winTarget = new EventTarget();
    const fakeWin = {
      addEventListener: winTarget.addEventListener.bind(winTarget),
      removeEventListener: winTarget.removeEventListener.bind(winTarget),
    };

    const onHide = vi.fn();
    const onShow = vi.fn();
    dispose = createVisibilityPauseHandler({
      onHide,
      onShow,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doc: fakeDoc as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      win: fakeWin as any,
    });

    hidden = true;
    target.dispatchEvent(new Event('visibilitychange'));
    expect(onHide).toHaveBeenCalledTimes(1);

    hidden = false;
    target.dispatchEvent(new Event('visibilitychange'));
    expect(onShow).toHaveBeenCalledTimes(1);

    winTarget.dispatchEvent(new Event('focus'));
    expect(onShow).toHaveBeenCalledTimes(2);
  });
});
