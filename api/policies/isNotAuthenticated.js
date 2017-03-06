module.exports = function (req, res, next) {

  if (req.session.passport && req.session.passport.user) return res.forbidden('You should not be authenticated!', 'policy.autenticated');

  return next();

};
