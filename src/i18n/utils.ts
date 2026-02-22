import { en } from './en';
import { es } from './es';

const translations = { en, es } as const;

export type Lang = 'en' | 'es';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  return lang === 'es' ? 'es' : 'en';
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return translations[lang][key] ?? translations['en'][key] ?? key;
  };
}
