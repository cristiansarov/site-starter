module.exports = {
  sendMail: function(options) {
    return new Promise((resolve, reject) => {
      const from = options.from || 'Site starter <no-reply@site-starter.com>';
      const to = options.to;
      const subject = options.subject;
      const html = options.content;

      if(!sails.config.email) return reject('No email transport is configured.');

      if(!to || !subject || !html) {
        const fields = [];
        if(!to) fields.push('"to"');
        if(!subject) fields.push('"subject"');
        if(!html) fields.push('"content"');
        return reject('The following fields are missing: '+fields.join(', '));
      }

      require('nodemailer').createTransport(sails.config.email).sendMail({from: from, to: to, subject: subject, html: html},
        function(err) {
          if(err) reject(err);
          resolve();
        });

    })
  }
};
