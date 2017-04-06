'use strict';

/**
 * Set the environment
 */
const args = require('minimist')(process.argv.slice(2));
const allowedEnvs = ['dev', 'dist', 'test'];
let env;
if (args._.length > 0 && args._.indexOf('start') !== -1) {
  env = 'test';
} else if (args.env && args.env && args.env.length > 0 && allowedEnvs.indexOf(args.env) !== -1) {
  env = args.env;
} else {
  env = 'dev';
}
process.env.REACT_WEBPACK_ENV = env;



/**
 * Build the webpack configuration
 * @param  {String} wantedEnv The wanted environment
 * @return {Object} Webpack config
 */
const path = require('path');
const _ = require('lodash');
const config = {
  srcPath: path.join(__dirname, '../src'),
  //host: require('ip').address(),
  host: 'localhost',
  port: args.port || 8001,
  proxyPort: args.proxyPort || 9000,
  additionalPaths: []
};


module.exports = _.merge(
  {},
  config,
  {
    port: config.port,
    debug: true,
    output: {
      path: path.join(__dirname, '../dist'),
      filename: 'app.js',
      libraryTarget: 'var',
      library: 'XLSX'
    },
    devServer: {
      contentBase: './src/',
      historyApiFallback: true,
      hot: true,
      port: config.port,
      noInfo: false,
      compress: true,
      proxy: {
        '/api/*' : {
          target: `http://localhost:${config.proxyPort}`,
          secure: false
        },
        '/images/*' : {
          target: `http://localhost:${config.proxyPort}`,
          secure: false
        },
      }
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
      alias: {
        core: `${config.srcPath}/core`,
        Main: `${config.srcPath}/Main`,
        Layout: `${config.srcPath}/Main/Layout`,
        modules: `${config.srcPath}/modules`,
        ContentComponents: `${config.srcPath}/core/utils/components/ContentComponents`,
        FormComponents: `${config.srcPath}/core/utils/components/FormComponents`,
        filters: `${config.srcPath}/core/utils/filters`,
        helpers: `${config.srcPath}/core/utils/helpers`
      }
    },
    node: {
      fs: false,
      Buffer: false
    },
    externals: [
      {
        './cptable': 'var cptable',
        '../xlsx.js': 'var _XLSX'
      }
    ],
    module: {
      noParse: [/jszip.js$/]
      // preLoaders: [
      //   {
      //     test: /\.(js|jsx)$/,
      //     include: config.srcPath,
      //     loader: 'eslint-loader'
      //   }
      // ]
    }
  },
  require(path.join(__dirname, './' + env))(config)
);
