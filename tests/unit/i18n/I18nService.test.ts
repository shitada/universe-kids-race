import { afterEach, describe, expect, it } from 'vitest';
import { I18nService, i18n } from '../../../src/game/i18n/i18nService';
import { DEFAULT_LANGUAGE } from '../../../src/game/i18n/types';

describe('I18nService', () => {
  afterEach(() => {
    i18n.setLanguage(DEFAULT_LANGUAGE, { notify: false });
  });

  it('returns localized strings and interpolates params', () => {
    const service = new I18nService();
    service.setLanguage('en');

    expect(service.t('colorSettings.close')).toBe('Close');
    expect(service.t('colorSettings.motion.preview.playing', { emoji: '⚡', label: 'Fast' })).toBe('⚡ Previewing Fast');
  });

  it('falls back to the key when a translation is missing', () => {
    const service = new I18nService();

    expect(service.t('missing.translation.key')).toBe('missing.translation.key');
  });

  it('notifies listeners when the language changes', () => {
    const service = new I18nService();
    const seen: string[] = [];
    const unsubscribe = service.subscribe((language) => seen.push(language));

    service.setLanguage('en');
    unsubscribe();
    service.setLanguage('ja');

    expect(seen).toEqual(['en']);
  });
});
