module.exports = {
  sendContactForm: function (req, res) {

    const notificationEmails = ['cristian@sarov.ro'];
    if (sails.config.environment !== 'development') notificationEmails.push('eliza.stefan@gentlab.com');
    const signupData = req.body;
    const content = Object.keys(signupData).map(fieldName => {
      return `<p><strong>${fieldName}</strong>: ${signupData[fieldName].replace(/(?:\r\n|\r|\n)/g, '<br />')}</p>`
    }).join('');

    Promise.all([
      ContactForm.create(signupData),
      MailService.sendMail({
        from: 'Gentlab Admin Panel <no-reply@gentlab.com>',
        to: notificationEmails.join(','),
        subject: '[Gentlab] New contact form filled',
        content
      })
    ]).then(() => {
      res.ok();
    }).catch(err => {
      res.negotiate(err);
    });

  }
};
