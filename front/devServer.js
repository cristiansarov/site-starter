/* eslint no-console:0 */
'use strict';
const config = require('./webpack/webpack.config.js');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');


new WebpackDevServer(webpack(config), config.devServer)
.listen(config.devServer.port, config.devServer.host, (err) => {
  if (err) console.log(err);
  console.log('Listening at http://'+config.devServer.host+':' + config.devServer.port);
});
