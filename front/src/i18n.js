exports.generate = function(locale) {
  const capitalizedLocale = locale.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } ); // en => En
  return [
    `core/Main/i18n/i18n${capitalizedLocale}`,
    `modules/Article/i18n/ArticleI18n${capitalizedLocale}`
  ]
};
