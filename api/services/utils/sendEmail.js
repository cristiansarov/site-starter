module.exports = function(options, success, error) {

    var from = options.from || sails.config.email.from;
    var to = options.to;
    var subject = options.subject;
    var html = options.content;
    if(to && subject && html) {
        require('nodemailer').createTransport(sails.config.email).sendMail({from: from, to: to, subject: subject, html: html},
        function(err) {
            if(err) {
                console.log(err)
                error(err);
            } else success();
        });
    } else {
        var fields = [];
        if(!to) fields.push('"to"');
        if(!subject) fields.push('"subject"');
        if(!html) fields.push('"content"');
        return error('The following fields are missing: '+fields.join(', '));
    }

};
