var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function (req, res) {
    if(!req.params.all().username) return res.badRequest();
    passport.authenticate('local', function (err, user, info) {
      if (err) return res.serverError(err);
      if (!user) return res.badRequest();
      req.logIn(user, function (err) {
        if (err) return res.ok(err);
        return res.ok({
          message: info.message,
          user: user
        });
      });
    })(req, res);
  },


  logout: function (req, res) {
    req.logout();
    res.ok();
  },

  currentUser: function (req, res) {
    if (!req.user) return res.badRequest();
    User.findOne(req.user.id).exec(function(err, user) {
      if (err) return res.serverError(err);
      res.ok(user)
    })
  },

  checkAuthentication: function (req, res) {
    if (!(req.session.passport && req.session.passport.user)) return res.badRequest();
    res.ok()
  },

  passwordResetStep1: function (req, res) {
    var email = req.param('email');
    User.findOne({email: email}).exec(function (err, user) {
      if (err) return res.serverError(err);
      if (!user) return res.badRequest({status: 'failed'});
      generateToken(user);
    });
    function generateToken(user) {
      require('crypto').randomBytes(10, function (ex, buf) {
        var token = buf.toString('hex');
        User.update(user.id, {token: token}).exec(function (err, user) {
          if (err) return res.serverError(err);
          sendEmailNotification(user[0])
        });
      });
    }

    function sendEmailNotification(user) {
      var siteName = sails.config.frontend.name;
      var currentLocale = sails.config.i18n.currentLocale;
      var link = sails.getBaseurl() + '/' + currentLocale + '/login?setNewPassword=true&token=' + user.token;
      var html = '<p>You have opted to reset your password on ' + siteName + '</p>' +
        '<p>To reset you password copy the code below:</p>' +
        '<p><strong>' + user.token + '</strong></p>' +
        '<p>or just click this link:</p>' +
        '<p><a href="' + link + '">' + link + '</a>';
      require('nodemailer').createTransport(sails.config.email).sendMail({
        from: siteName + ' <' + sails.config.email.from + '>',
        to: user.email,
        subject: 'Password Reset',
        html: html
      }, function (err) {
        if (err) return res.serverError(err);
        return res.ok();
      });
    }
  },

  passwordResetStep2: function (req, res) {
    var token = req.param('token');
    var password = req.param('password');
    User.findOne({token: token}).exec(function (err, user) {
      if (err) return res.serverError(err);
      if (!user) return res.badRequest();
      User.update(user.id, {token: null, password: password}).exec(function (err, users) {
        if (err) return res.serverError(err);
        return res.ok();
      });
    });
  },

  setLocale: function (req, res) {
    var locale = req.param('locale');
    if (!locale) return res.badRequest({message: 'Cannot set locale. No locale sent.'});
    req.session.currentLocale = locale;
    return res.ok();
  }


};
