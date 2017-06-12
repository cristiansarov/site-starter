const path = require('path');

module.exports = {
  signup: function (req, res) {
    const jobId = req.param('jobId');
    if(!jobId) return res.badRequest('A job id must be provided');

    const notificationEmails = ['cristian@sarov.ro'];
    if (sails.config.environment !== 'development') notificationEmails.push('eliza.stefan@gentlab.com');
    const signupData = req.body;
    delete signupData.attachment;
    signupData.job = jobId;

    // Create JobSignup entry & upload file
    Promise.all([
      JobSignup.create(signupData), // create the signup data
      UploadService.uploadFile(req, Media, 'attachment'), // upload the attachment
      Job.findOne(jobId) // get the job details
    ])
      .then(data => {
        const fileData = data[1];
        const jobName = data[2].name;
        return Promise.all([
          JobSignup.update(signupData.id, {attachment: fileData.id}), // update the signup data with the attachment
          MailService.sendMail({ // send the confirmation email to the staff
            from: 'Gentlab Admin Panel <no-reply@gentlab.com>',
            to: notificationEmails.join(','),
            subject: '[Gentlab] Some good fellow applied for a job',
            content: Object.keys(signupData).map(fieldName => {
              console.log('fieldValue = ', signupData[fieldName])
              const fieldValue = fieldName === 'job' ? jobName : signupData[fieldName].replace(/(?:\r\n|\r|\n)/g, '<br />')
              return `<p><strong>${fieldName}</strong>: ${fieldValue}</p>`
            }).join(''),
            attachments: [{
              filename: fileData.filename,
              path: path.join(sails.config.uploadsPath, fileData.path)
            }]
          })
        ]);
      })
      .then(() => {
        res.ok();
      })
      .catch(err => {
        res.negotiate(err);
      });

  }
};