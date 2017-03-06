module.exports = function (req, res, next) {

  if (!(req.session.passport && req.session.passport.user)) return res.forbidden('You are not authenticated', 'policy.notAutenticated');

  return next();

};
