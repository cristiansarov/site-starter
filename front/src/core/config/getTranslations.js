import assignDeep from 'assign-deep';


export default function getTranslations(i18nKeys) {
  const locales = ['en'];
  const translations = {};
  locales.forEach(locale=>{
    require('../../i18n').generate(locale).forEach(link=>{
      translations[locale] = assignDeep(translations[locale], require('../../'+link));
    });
    translations[locale] = assignDeep(translations[locale], i18nKeys);
  });
  return translations;
};


