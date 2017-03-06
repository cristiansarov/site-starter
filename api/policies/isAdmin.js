module.exports = function (req, res, next) {

  if (!(req.session.passport && req.session.passport.user)) return res.forbidden('You are not authenticated', 'policy.notAutenticated');

  User.query(`SELECT role FROM user WHERE id = ${req.session.passport.user}`).then(users => {
    const userRole = parseInt(users[0].role);
    if (!userRole) return res.forbidden({code: 'policy.userHasNoRole'});
    if (userRole != 5) return res.forbidden({code: 'policy.isNotAdmin'});
    return next();
  });

};
