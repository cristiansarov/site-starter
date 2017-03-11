'use strict';

let path = require('path');
let webpack = require('webpack');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let extractCSS = new ExtractTextPlugin('vendor.css');


module.exports = function(config) {
  return {
    entry: [
      'webpack-dev-server/client?http://'+config.host+':' + config.port,
      'webpack/hot/only-dev-server',
      path.join(__dirname, '../src/Main/Layout/assets/styles/vendor'),
      path.join(__dirname, '../src/index.js')
    ],
    cache: true,
    devtool: 'cheap-module-eval-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new BowerWebpackPlugin({
        searchResolveModulesDirectories: false
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new CopyWebpackPlugin([{
        from: 'src/Main/Layout/assets/images/favicon.png', to: 'assets/favicon.png'
      }]),
      new HtmlWebpackPlugin({ // generates index.html in output
        template: 'src/index.ejs',
        filename: 'index.html',
        isDev: true
      }),
      extractCSS
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          exclude: [path.join(__dirname, '../src/Main/Layout/assets/styles')],
          loader: 'style-loader!css-loader'
        },
        {
          test: /\.css$/,
          include: [path.join(__dirname, '../src/Main/Layout/assets/styles')],
          loader: extractCSS.extract('style','css')
        },
        {
          test: /\.scss$/,
          loader: 'style-loader!css-loader?sourceMap!sass-loader'
        },
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&mimetype=application/font-woff&name=assets/[hash].[ext]"
        }, {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&mimetype=application/font-woff&name=assets/[hash].[ext]"
        }, {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&mimetype=application/octet-stream&name=assets/[hash].[ext]"
        }, {
          test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&mimetype=font/opentype&name=assets/[hash].[ext]"
        }, {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file?name=assets/[hash].[ext]"
        }, {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          include: [path.join(__dirname, '../src/Main/Layout/assets/styles/fonts')],
          loader: 'url?limit=10000&mimetype=image/svg+xml&name=assets/[hash].[ext]'
        },
        {
          test: /\.(svg|png|jpg|gif)$/,
          exclude: [path.join(__dirname, '../src/Main/Layout/assets/styles/fonts')],
          loader: 'url-loader?limit=8192&name=assets/[hash].[ext]'
        },
        { test: /\.ejs$/, loader: 'ejs-loader' },
        {
          test: /\.(js|jsx)$/,
          loader: 'react-hot!babel-loader',
          include: [].concat(
            config.additionalPaths,
            [ path.join(__dirname, '/../src') ]
          )
        }
      ]
    }
  }
};
