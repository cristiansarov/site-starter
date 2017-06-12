'use strict';

let path = require('path');
let webpack = require('webpack');

// Add needed plugins here
var CopyWebpackPlugin = require('copy-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let extractCSS = new ExtractTextPlugin({filename: 'app.css'});

const devConfig = {
  host: 'localhost',
  port: 8000
};


module.exports = {

  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    host: devConfig.host,
    port: devConfig.port,
    noInfo: false,
    compress: true,
    proxy: {
      '/api/*': {
        target: 'http://localhost:9000',
        secure: false
      },
      '/images/*': {
        target: 'http://localhost:9000',
        secure: false
      },
      '/admin/*': {
        target: 'http://localhost:9000',
        secure: false
      }
    }
  },

  entry: [
    'webpack-dev-server/client?http://' + devConfig.host + ':' + devConfig.port,
    'webpack/hot/only-dev-server',
    path.join(__dirname, '../src/Layout/assets/vendor/vendor'),
    path.join(__dirname, '../src/index.js')
  ],

  output: {
    publicPath: `http://${devConfig.host}:${devConfig.port}/`,
    filename: 'app.js'
  },

  cache: true,
  devtool: 'cheap-module-eval-source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{
      from: 'src/Layout/assets/images/favicon.png', to: 'assets/favicon.png'
    }]),
    extractCSS
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        include: path.join(__dirname, '../src'),
        loader: 'eslint-loader'
      },
      {
        test: /\.css$/,
        exclude: [path.join(__dirname, '../src/Layout/assets/vendor')],
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.css$/,
        include: [path.join(__dirname, '../src/Layout/assets/vendor')],
        loader: extractCSS.extract({fallback: 'style-loader', use: 'css-loader'})
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {loader: 'css-loader', options: {sourceMap: true}},
          {loader: 'sass-loader', options: {outputStyle: 'expanded', data: `
            @import "${path.join(__dirname, '../src')}/core/Main/Main.scss";
            @import "${path.join(__dirname, '../src')}/Layout/LayoutVariables.scss";
          `}}
        ]
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
        loader: 'react-hot-loader!babel-loader',
        include: [path.join(__dirname, '../src')]
      }
    ]
  }

};
