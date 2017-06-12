'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {

  entry: [
    path.join(__dirname, '../src/server.js')
  ],

  output: {
    filename: './index.js',
    libraryTarget: 'commonjs2' // module.exports = <file_content>;
  },

  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve(__dirname, '../node_modules')).concat([
    'react-dom/server', 'react/addons'
  ]).reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod;
    return ext
  }, {}),

  resolveLoader: {
    alias: {
      'asset-loader': path.join(__dirname, './loaders/asset.js'),
    }
  },

  module: {
    rules: [
      {
        test: /\.(scss|css|html|ejs|woff|woff2|ttf|otf|eot)$/,
        loader: 'null-loader'
      },
      {
        test: /^\.\/.*$/,
        loader: 'null-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        include: [path.join(__dirname, '../src/Layout/assets/vendor/fonts')],
        loader: 'null-loader'
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        exclude: [path.join(__dirname, '../src/Layout/assets/vendor/fonts')],
        loader: 'asset-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, '../src/')]
      }
    ]
  }

}
