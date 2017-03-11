'use strict';

let path = require('path');
let webpack = require('webpack');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let extractCSS = new ExtractTextPlugin('app.css');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(config) {
  return {
    entry: path.join(__dirname, '../src/index.js'),
    cache: false,
    devtool: 'cheap-module-source-map',
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new BowerWebpackPlugin({
        searchResolveModulesDirectories: false
      }),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new ExtractTextPlugin('app.css'),
      new HtmlWebpackPlugin({
        template: 'src/index.ejs',
        filename: 'index.html'
      }),
      new CopyWebpackPlugin([{
        from: 'src/Main/Layout/assets/images/favicon.png', to: 'assets/favicon.png'
      }]),
      extractCSS
    ],
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: extractCSS.extract(['css','sass'])
        },
        {
          test: /\.css$/,
          loader: extractCSS.extract(['css'])
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
        {
          test: /\.(js|jsx)$/,
          loader: 'babel',
          include: [].concat(
            config.additionalPaths,
            [ path.join(__dirname, '/../src') ]
          )
        }
      ]
    }
  }
};
