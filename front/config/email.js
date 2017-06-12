var mg = require('nodemailer-mailgun-transport');

module.exports.email = mg({

  auth: {
    api_key: 'key-80d73a167c74950762c75ea9b01f12f7',
    domain: 'mg.gentlab.com'
  }

});