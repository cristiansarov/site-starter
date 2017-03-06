var path = require('path');
var routes = {};


// Generated assets
routes['/sitemap.xml'] =                                    require('./routes/sitemap').generate;
routes['/robots.txt'] =                                     require('./routes/robots').default;
routes['/config.js'] =                                      'ConfigController.getMainConfig';




/**
 * SECURITY
 */
routes['POST /api/security/login'] =                        'AuthController.login';
routes['GET  /api/security/logout'] =                       'AuthController.logout';
routes['GET  /api/security/currentUser'] =                  'AuthController.currentUser';
routes['GET  /api/security/checkAuthentication'] =          'AuthController.checkAuthentication';
routes['POST /api/security/password-reset-step-1'] =        'AuthController.passwordResetStep1';
routes['POST /api/security/password-reset-step-2'] =        'AuthController.passwordResetStep2';


/**
 * IMAGE
 */
routes['POST /api/image/upload'] =                          'ImageController.upload';
routes['GET  /images/:size/:filename'] =                    'ImageController.serve';
routes['GET  /images/:filename'] =                          'ImageController.serve';


/**
 * ADMIN
 */
routes['GET    /api/:modelName/list/paged'] =                require('../api/blueprints/getPagedList');
routes['GET    /api/:modelName/list'] =                      require('../api/blueprints/getList');
routes['GET    /api/:modelName/get/:modelId'] =              require('../api/blueprints/getItem');
routes['POST   /api/:modelName/create'] =                    require('../api/blueprints/saveItem');
routes['PUT    /api/:modelName/update/:modelId'] =           require('../api/blueprints/saveItem');
routes['DELETE /api/:modelName/delete/multiple'] =           require('../api/blueprints/deleteMultiple');
routes['DELETE /api/:modelName/delete/:modelId'] =           require('../api/blueprints/deleteItem');



// // Additional general model blueprints
// routes['GET  /api/:model/find'] =                           require('../api/blueprints/find');
// routes['GET  /api/:model/count'] =                          require('../api/blueprints/count');
// routes['GET  /api/:model/findOne'] =                        require('../api/blueprints/findOne');
// routes['GET  /api/:model/getSlug/:slug/:locale'] =          require('../api/blueprints/getSlug');
// routes['POST /api/:model/import'] =                         require('../api/blueprints/import');
//
// // Additional specific methods
// routes['GET  /api/getAbsUrl/:stateName'] =                  require('./routes/frontRoutes').getRouteAbsUrl;
// routes['POST /api/mailchimp/subscribe/:list'] =             'MailChimpController.subscribe';
// routes['POST /api/email/send'] =                            'EmailController.send';
// routes['POST /api/media/upload'] =                          'MediaController.upload';
// routes['GET  /api/media/:id/serve'] =                       'MediaController.serve';
// routes['POST /api/image/upload'] =                          'ImageController.upload';
// routes['GET  /images/:size/:filename'] =                    'ImageController.serve';
// routes['GET  /images/:filename'] =                          'ImageController.serve';
// routes['POST /auth/login'] =                                'AuthController.login';
// routes['GET  /auth/logout'] =                               'AuthController.logout';
// routes['GET  /auth/user'] =                                 'AuthController.user';
// routes['GET  /auth/passport'] =                             'AuthController.passport';
// routes['POST /auth/password-reset-step-1'] =                'AuthController.passwordResetStep1';
// routes['POST /auth/password-reset-step-2'] =                'AuthController.passwordResetStep2';
//
// // Import
// routes['POST /api/import/getCategoryObjects'] =             require('../api/DTOs/importGetCategoryObjects.js');
// routes['POST /api/import/check'] =                          require('../api/DTOs/importCheck.js');
//
// routes['GET /api/article/getList'] =                        'ArticleController.getList';
// routes['GET /api/article/getRoutes'] =                      'ArticleController.getCount';
//
//
// routes['/admin*'] = function (req, res) {
//   return res.sendfile(path.join(__dirname, '../../admin/dist/index.html'));
// };

module.exports.routes = routes;
