const path = require('path');

module.exports = function (sails) {
  const loader = require('sails-util-mvcsloader')(sails);
  const rootPath = path.join(__dirname, '../../../', sails.config.site);
  loader.configure({
    config: path.join(rootPath, '/config'),
    policies: path.join(rootPath, '/api/policies')
  });
  return {
    initialize: function (next) {
      loader.inject({
        controllers: path.join(rootPath, '/api/controllers'),
        models: path.join(rootPath, '/api/models'),
        services: path.join(rootPath, '/api/services')
      }, function (err) {
        return next(err);
      });
    }
  };
};
