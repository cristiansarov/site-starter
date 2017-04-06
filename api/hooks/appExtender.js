const path = require('path');

module.exports = function (sails) {
  const loader = require('sails-util-mvcsloader')(sails);
  const sitePath = sails.config.sitePath;
  loader.configure({
    config: path.join(sitePath, '/config'),
    policies: path.join(sitePath, '/api/policies')
  });
  return {
    initialize: function (next) {
      loader.inject({
        controllers: path.join(sitePath, '/api/controllers'),
        models: path.join(sitePath, '/api/models'),
        services: path.join(sitePath, '/api/services')
      }, function (err) {
        return next(err);
      });
    }
  };
};
