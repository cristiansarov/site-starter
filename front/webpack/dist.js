'use strict';

let path = require('path');
let webpack = require('webpack');

// Add needed plugins here
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let extractCSS = new ExtractTextPlugin({filename: 'app.[hash].css'});
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, '../src/Layout/assets/vendor/vendor'),
    path.join(__dirname, '../src/index.js')
  ],
  output: {
    filename: 'app.[hash].js'
  },
  cache: false,
  devtool: 'cheap-module-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false,screw_ie8: true,conditionals: true,unused: true,comparisons: true,sequences: true,dead_code: true,evaluate: true,if_return: true,join_vars: true},
      output: {comments: false}
    }),
    new CopyWebpackPlugin([{
      from: 'src/Layout/assets/images/favicon.png', to: 'assets/favicon.png'
    }]),
    extractCSS,
    function () { // write hash.js file for easy identifying
      this.plugin('done', function (stats) {
        require('fs').writeFileSync(path.join(__dirname, '../dist/hash.js'), 'module.exports = \'' + stats.hash + '\'')
      });
    }
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: extractCSS.extract({use: [
          'css-loader',
          {loader: 'sass-loader', options: {data: `
            @import "${path.join(__dirname, '../src')}/core/Main/Main.scss";
            @import "${path.join(__dirname, '../src')}/Layout/LayoutVariables.scss";
          `}}
        ]})
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract({use: ['css-loader']})
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[hash].[ext]'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[hash].[ext]'
      }, {
        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=font/opentype&name=fonts/[hash].[ext]'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=fonts/[hash].[ext]'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        include: [path.join(__dirname, '../src/Layout/assets/vendor/fonts')],
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[hash].[ext]'
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        exclude: [path.join(__dirname, '../src/Layout/assets/vendor/fonts')],
        loader: 'file-loader?limit=8192&name=assets/[name].[ext]'
      },
      {
        test: /\.(html|ejs)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, '../src')],
        exclude: [path.join(__dirname, '../src/server.js')]
      }
    ]
  }
};
