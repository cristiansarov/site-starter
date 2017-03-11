const path = require('path');
const routes = {};

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
routes['POST   /api/:modelName/import'] =                    require('../api/blueprints/import');
routes['POST   /api/import/check'] =                         'ImportController.check';
routes['POST   /api/import/getCategoryObjects'] =            'ImportController.getCategoryObjects';


module.exports.routes = routes;
