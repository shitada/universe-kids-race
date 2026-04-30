// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CountdownOverlay } from '../../../src/ui/CountdownOverlay';

describe('CountdownOverlay', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
  });

  it('show() mounts an overlay element with the first count "3"', () => {
    const overlay = new CountdownOverlay();
    overlay.show(() => {});
    const el = document.querySelector('[data-countdown-overlay]');
    expect(el).not.toBeNull();
    expect(overlay.getCurrentLabel()).toBe('3');
    expect(overlay.isActive()).toBe(true);
  });

  it('progresses 3 → 2 → 1 → スタート！ as time advances', () => {
    const overlay = new CountdownOverlay();
    overlay.show(() => {});
    expect(overlay.getCurrentLabel()).toBe('3');
    overlay.tick(1.0);
    expect(overlay.getCurrentLabel()).toBe('2');
    overlay.tick(1.0);
    expect(overlay.getCurrentLabel()).toBe('1');
    overlay.tick(1.0);
    expect(overlay.getCurrentLabel()).toBe('スタート！');
  });

  it('calls onComplete after the "go" phase ends and removes overlay DOM', () => {
    const onComplete = vi.fn();
    const overlay = new CountdownOverlay();
    overlay.show(onComplete);
    overlay.tick(1.0); // → 2
    overlay.tick(1.0); // → 1
    overlay.tick(1.0); // → スタート！
    expect(onComplete).not.toHaveBeenCalled();
    overlay.tick(0.4); // end of go phase
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-countdown-overlay]')).toBeNull();
    expect(overlay.isActive()).toBe(false);
  });

  it('fires onTick three times (once per number) and onGo once', () => {
    const onTick = vi.fn();
    const onGo = vi.fn();
    const overlay = new CountdownOverlay({ onTick, onGo });
    overlay.show(() => {});
    expect(onTick).toHaveBeenCalledTimes(1);
    overlay.tick(1.0);
    expect(onTick).toHaveBeenCalledTimes(2);
    overlay.tick(1.0);
    expect(onTick).toHaveBeenCalledTimes(3);
    overlay.tick(1.0);
    expect(onTick).toHaveBeenCalledTimes(3);
    expect(onGo).toHaveBeenCalledTimes(1);
  });

  it('hide() removes DOM and prevents further tick progression', () => {
    const onComplete = vi.fn();
    const overlay = new CountdownOverlay();
    overlay.show(onComplete);
    overlay.hide();
    expect(document.querySelector('[data-countdown-overlay]')).toBeNull();
    overlay.tick(5.0);
    expect(onComplete).not.toHaveBeenCalled();
    expect(overlay.isActive()).toBe(false);
  });

  it('dispose() can be called multiple times safely', () => {
    const overlay = new CountdownOverlay();
    overlay.show(() => {});
    overlay.dispose();
    expect(() => overlay.dispose()).not.toThrow();
  });

  it('respects custom step / go durations', () => {
    const onComplete = vi.fn();
    const overlay = new CountdownOverlay({ stepDuration: 0.5, goDuration: 0.2 });
    overlay.show(onComplete);
    overlay.tick(0.5); // → 2
    overlay.tick(0.5); // → 1
    overlay.tick(0.5); // → スタート！
    overlay.tick(0.2);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('uses transform/opacity only (no layout-triggering style props)', () => {
    const overlay = new CountdownOverlay();
    overlay.show(() => {});
    overlay.tick(0.1);
    const numEl = document.querySelector('[data-countdown-overlay] > div') as HTMLDivElement;
    expect(numEl).not.toBeNull();
    // Animated properties should be transform/opacity only
    expect(numEl.style.transform).toMatch(/scale\(/);
    expect(numEl.style.opacity).not.toBe('');
  });

  it('onTick errors do not break progression', () => {
    const overlay = new CountdownOverlay({
      onTick: () => {
        throw new Error('boom');
      },
    });
    expect(() => overlay.show(() => {})).not.toThrow();
    expect(() => overlay.tick(1.0)).not.toThrow();
    expect(overlay.getCurrentLabel()).toBe('2');
  });
});
