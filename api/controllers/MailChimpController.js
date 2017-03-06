module.exports = {

    subscribe: function(req, res) {

        // VARIABLES
        var unirest = require('unirest');
        var listId = sails.config.mailchimp.lists[req.param('list')];
        var apiKey = sails.config.mailchimp.apiKey;
        var dc = sails.config.mailchimp.dc;
        var data = req.param('data');

        // ACTION
        unirest
        .post('http://'+dc+'.api.mailchimp.com/3.0/lists/'+listId+'/members/')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'apikey '+apiKey})
        .send(data).end(function (response) {
            res.send(response.body);
        });

    }

};