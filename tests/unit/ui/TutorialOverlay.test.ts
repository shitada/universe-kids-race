// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TutorialOverlay } from '../../../src/ui/TutorialOverlay';

describe('TutorialOverlay', () => {
  let overlay: TutorialOverlay;

  beforeEach(() => {
    const uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);

    overlay = new TutorialOverlay();
  });

  afterEach(() => {
    overlay.hide();
    document.getElementById('ui-overlay')?.remove();
  });

  describe('show()', () => {
    it('creates overlay DOM inside #ui-overlay', () => {
      overlay.show(() => {});
      const uiOverlay = document.getElementById('ui-overlay')!;
      expect(uiOverlay.children.length).toBeGreaterThan(0);
    });

    it('creates 3 tutorial cards', () => {
      overlay.show(() => {});
      const uiOverlay = document.getElementById('ui-overlay')!;
      const cards = uiOverlay.querySelectorAll('[data-tutorial-card]');
      expect(cards.length).toBe(3);
    });

    it('prevents duplicate show() calls', () => {
      overlay.show(() => {});
      overlay.show(() => {});
      const uiOverlay = document.getElementById('ui-overlay')!;
      // Should only have one overlay container
      const overlays = uiOverlay.querySelectorAll('[data-tutorial-overlay]');
      expect(overlays.length).toBe(1);
    });

    it('creates close button with とじる text', () => {
      overlay.show(() => {});
      const uiOverlay = document.getElementById('ui-overlay')!;
      const closeBtn = uiOverlay.querySelector('button');
      expect(closeBtn).not.toBeNull();
      expect(closeBtn!.textContent).toBe('とじる');
    });

    it('invokes onClose callback when close button is pressed', () => {
      let called = false;
      overlay.show(() => { called = true; });
      const uiOverlay = document.getElementById('ui-overlay')!;
      const closeBtn = uiOverlay.querySelector('button')!;
      closeBtn.dispatchEvent(new Event('pointerdown'));
      expect(called).toBe(true);
    });
  });

  describe('hide()', () => {
    it('removes overlay DOM from #ui-overlay', () => {
      overlay.show(() => {});
      overlay.hide();
      const uiOverlay = document.getElementById('ui-overlay')!;
      const overlays = uiOverlay.querySelectorAll('[data-tutorial-overlay]');
      expect(overlays.length).toBe(0);
    });

    it('does nothing when not visible', () => {
      // Should not throw
      overlay.hide();
      const uiOverlay = document.getElementById('ui-overlay')!;
      expect(uiOverlay.children.length).toBe(0);
    });
  });
});
