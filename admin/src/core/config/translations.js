import assignDeep from 'assign-deep';
const locales = ['en', 'ro'];
const translations = {};

locales.forEach(locale=>{
  require('../../i18n').generate(locale).forEach(link=>{
    translations[locale] = assignDeep(translations[locale], require('../../'+link));
  });
});

export default translations;


