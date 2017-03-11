/* eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const config = require('./webpack/webpack.config.js');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');


new WebpackDevServer(webpack(config), config.devServer)
.listen(config.port, config.host, (err) => {
  if (err) console.log(err);
  console.log('Listening at http://'+config.host+':' + config.port);
});
