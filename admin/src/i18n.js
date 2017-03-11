exports.generate = function(locale) {
  var capitalizedLocale = locale.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } ); // en => En
  return [
    `core/security/i18n/securityI18n${capitalizedLocale}`,
    `Main/Layout/i18n/layoutI18n${capitalizedLocale}`,
    `modules/Dashboard/i18n/DashboardI18n${capitalizedLocale}`,
    `modules/MyAccount/i18n/MyAccountI18n${capitalizedLocale}`
  ]
};
