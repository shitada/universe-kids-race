// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EncyclopediaOverlay } from '../../../src/ui/EncyclopediaOverlay';

describe('EncyclopediaOverlay', () => {
  let overlay: EncyclopediaOverlay;
  let uiOverlay: HTMLDivElement;

  beforeEach(() => {
    uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);
    overlay = new EncyclopediaOverlay();
  });

  afterEach(() => {
    overlay.hide();
    uiOverlay.remove();
  });

  it('show creates fullscreen DOM in #ui-overlay', () => {
    overlay.show([], () => {});
    expect(uiOverlay.children.length).toBe(1);
  });

  it('card grid renders 11 slots', () => {
    overlay.show([], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    expect(cards.length).toBe(11);
  });

  it('unlocked card shows emoji and name', () => {
    overlay.show([1], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    expect(firstCard.textContent).toContain('🌙');
    expect(firstCard.textContent).toContain('月');
  });

  it('locked card shows ???', () => {
    overlay.show([], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    expect(firstCard.textContent).toContain('？？？');
  });

  it('locked card has opacity 0.6', () => {
    overlay.show([], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    expect(firstCard.style.opacity).toBe('0.6');
  });

  it('detail modal on unlocked card tap shows trivia', () => {
    overlay.show([1], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    firstCard.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    const detail = uiOverlay.querySelector('[data-detail]') as HTMLElement;
    expect(detail).not.toBeNull();
    expect(detail.textContent).toContain('つきは ちきゅうの まわりを まわっているよ');
  });

  it('hideDetail returns to gallery', () => {
    overlay.show([1], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    firstCard.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    // Click back button in detail
    const backBtn = uiOverlay.querySelector('[data-detail-back]') as HTMLElement;
    expect(backBtn).not.toBeNull();
    backBtn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    const detail = uiOverlay.querySelector('[data-detail]');
    expect(detail).toBeNull();
  });

  it('hide removes DOM', () => {
    overlay.show([], () => {});
    expect(uiOverlay.children.length).toBe(1);
    overlay.hide();
    expect(uiOverlay.children.length).toBe(0);
  });

  it('double-show prevention', () => {
    overlay.show([], () => {});
    overlay.show([], () => {});
    expect(uiOverlay.children.length).toBe(1);
  });

  it('back button calls onClose', () => {
    let closed = false;
    overlay.show([], () => { closed = true; });
    const backBtn = uiOverlay.querySelector('[data-gallery-back]') as HTMLElement;
    expect(backBtn).not.toBeNull();
    backBtn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(closed).toBe(true);
  });
});
