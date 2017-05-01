module.exports = {
  sendMail: function(options) {
    return new Promise((resolve, reject) => {
      const from = options.from || 'Site starter <no-reply@site-starter.com>';
      const to = options.to;
      const subject = options.subject;
      const html = options.content;
      const attachments = options.attachments;

      if(!sails.config.email) return reject('No email transport is configured.');

      if(!to || !subject || !html) {
        const fields = [];
        if(!to) fields.push('"to"');
        if(!subject) fields.push('"subject"');
        if(!html) fields.push('"content"');
        return reject('The following fields are missing: '+fields.join(', '));
      }

      require('nodemailer').createTransport(sails.config.email).sendMail({from, to, subject, html, attachments},
        function(err) {
          if(err) reject(err);
          resolve();
        });

    })
  }
};
