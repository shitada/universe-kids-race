import type { Language } from '../../types';
import { translations } from './translations';
import { DEFAULT_LANGUAGE, LANGUAGES, type TranslationKey, type TranslationParams } from './types';

type LanguageListener = (language: Language) => void;

function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce((result, [key, value]) => (
    result.replaceAll(`{${key}}`, String(value))
  ), template);
}

export class I18nService {
  private language: Language = DEFAULT_LANGUAGE;
  private readonly listeners = new Set<LanguageListener>();

  getLanguage(): Language {
    return this.language;
  }

  setLanguage(language: Language, options: { notify?: boolean } = {}): void {
    if (!isLanguage(language) || this.language === language) {
      return;
    }

    this.language = language;
    if (options.notify === false) {
      return;
    }

    for (const listener of this.listeners) {
      listener(language);
    }
  }

  t(key: TranslationKey | string, params?: TranslationParams): string {
    const localized = translations[this.language][key as TranslationKey]
      ?? translations[DEFAULT_LANGUAGE][key as TranslationKey]
      ?? key;
    return interpolate(localized, params);
  }

  subscribe(listener: LanguageListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const i18n = new I18nService();
