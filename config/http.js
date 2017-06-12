/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */


module.exports.http = {

  /****************************************************************************
   *                                                                           *
   * Express middleware to use for every Sails request. To add custom          *
   * middleware to the mix, add a function to the middleware config object and *
   * add its key to the "order" array. The $custom key is reserved for         *
   * backwards-compatibility with Sails v0.9.x apps that use the               *
   * `customMiddleware` config option.                                         *
   *                                                                           *
   ****************************************************************************/


  customMiddleware: function (app) {
    const bodyParser = require('body-parser');
    const express = require('express');
    const path = require('path');
    const sitePath = sails.config.sitePath;

    // CONFIG
    app.set('views', path.join(sitePath, '/src'));
    app.use(bodyParser({limit: '10mb', extended: true})); // enable gzip compression
    app.use(require('compression')()); // enable gzip compression
    app.use(function (req, res, next) { // add favicon
      if (req.url === '/favicon.ico') return res.send(200);
      next();
    });
    app.use(function (req, res, next) { // add cache to assets
      if (req.url.indexOf('/assets/') === 0 || req.url.indexOf('/images/') === 0 || req.url.indexOf('/api/image/') === 0 || req.url.indexOf('/app.') === 0) {
        res.setHeader('Cache-Control', 'public, max-age=2592000');
        res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
      }
      next();
    });

    // ASSETS
    app.use('/admin/', express.static(path.join(__dirname, '../admin/dist/'), {maxage: '30d'})); // static files
    app.use('/', express.static(path.join(sitePath, 'dist/'), {maxage: '30d'}));

  },

  middleware: {

    redirects: function (req, res, next) {
      if(sails.config.redirects) {
        sails.config.redirects.middleware(req, res, next);
      } else next();
    },
    passportInit: require('passport').initialize(),
    passportSession: require('passport').session(),

    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP request. (the Sails *
     * router is invoked by the "router" middleware below.)                     *
     *                                                                          *
     ***************************************************************************/

    order: [
      'redirects',
      'startRequestTimer',
      'cookieParser',
      'session',
      'passportInit',
      'passportSession',
      'customMiddleware',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ]

    /****************************************************************************
     *                                                                           *
     * Example custom middleware; logs each request to the console.              *
     *                                                                           *
     ****************************************************************************/

    //myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    //},


    /***************************************************************************
     *                                                                          *
     * The body parser that will handle incoming multipart HTTP requests. By    *
     * default as of v0.10, Sails uses                                          *
     * [skipper](http://github.com/balderdashy/skipper). See                    *
     * http://www.senchalabs.org/connect/multipart.html for other options.      *
     *                                                                          *
     ***************************************************************************/

    //bodyParser: require('skipper')

  },

  /***************************************************************************
   *                                                                          *
   * The number of seconds to cache flat files on disk being served by        *
   * Express static middleware (by default, these files are in `.tmp/public`) *
   *                                                                          *
   * The HTTP static cache is only active in a 'production' environment,      *
   * since that's the only time Express will cache flat-files.                *
   *                                                                          *
   ***************************************************************************/

  cache: 31557600000
};
