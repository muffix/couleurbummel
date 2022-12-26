import 'dayjs/locale/de';
import 'dayjs/locale/en';

import dayjs from 'dayjs';
import iso3166 from 'i18n-iso-countries';
import i18n, {LanguageDetectorModule} from 'i18next';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {findBestAvailableLanguage} from 'react-native-localize';

import de from './locales/de';
import en from './locales/en';

export const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
} as const;

iso3166.registerLocale(require('i18n-iso-countries/langs/en.json'));
iso3166.registerLocale(require('i18n-iso-countries/langs/de.json'));

dayjs.extend(require('dayjs/plugin/localizedFormat'));

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () => findBestAvailableLanguage(['de', 'en'])?.languageTag,
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

dayjs.locale(i18next.language);

export default i18n;
