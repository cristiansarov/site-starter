module.exports = {
  subscribe: function (req, res) {

    if (!sails.config.mailchimp) return res.badRequest('No mailchimp config is set!');

    const {list, fields} = req.params.all();
    if (!list) return res.badRequest('No list parameter provided');
    if (!fields) return res.badRequest('No fields parameter provided');

    // VARIABLES
    const unirest = require('unirest');
    const listId = sails.config.mailchimp.lists[list];
    const apiKey = sails.config.mailchimp.apiKey;
    const dc = sails.config.mailchimp.dc;

    // ACTION
    unirest
      .post('http://' + dc + '.api.mailchimp.com/3.0/lists/' + listId + '/members/')
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `apikey ${apiKey}`})
      .send({
        email_address: fields.EMAIL,
        status: 'subscribed',
        merge_fields: fields
      })
      .end(function (response) {
        res.ok(response.body);
      });

  }
};
