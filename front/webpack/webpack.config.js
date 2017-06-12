'use strict';

/**
 * Set the environment
 */
const args = require('minimist')(process.argv.slice(2));
const allowedEnvs = ['dev', 'dist', 'server'];
const env = args.env && allowedEnvs.indexOf(args.env) !== -1 ? args.env : 'dev';


/**
 * Build the webpack configuration
 * @param  {String} wantedEnv The wanted environment
 * @return {Object} Webpack config
 */
const path = require('path');
const _ = require('lodash');


module.exports = _.merge(
  {},
  {
    output: {
      path: path.join(__dirname, '../dist')
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        core: path.join(__dirname, '../src/core'),
        Layout: path.join(__dirname, '../src/Layout'),
        modules: path.join(__dirname, '../src/modules'),
        node_modules: path.join(__dirname, '../node_modules')
      }
    }
  },
  require(path.join(__dirname, './' + env))
);
