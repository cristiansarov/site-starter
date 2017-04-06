/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // wrap waterline query method to return a promise
  const Promise = require('bluebird');
  Object.keys(sails.models).forEach(function (key) {
    if (sails.models[key].query) {
      sails.models[key].query = Promise.promisify(sails.models[key].query);
    }
  });

  GenerateInitialData().then(function () {
    cb();
  });

};
