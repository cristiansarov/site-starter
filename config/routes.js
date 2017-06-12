const path = require('path');
const routes = {};

// Generated assets
routes['GET /sitemap.xml'] =                                    require('./routes/sitemap').default;
routes['GET /robots.txt'] =                                     require('./routes/robots').default;
routes['GET /config.js'] =                                      'ConfigController.getMainConfig';


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
 * CONFIG
 */
routes['GET  /api/config/getMainConfig'] =                  'ConfigController.getMainConfig';
routes['GET  /api/config/models'] =                         'ConfigController.models';
routes['GET  /api/config/mainMenu'] =                       'ConfigController.mainMenu';
routes['GET  /api/config/getData'] =                           'ConfigController.getData';


/**
 * IMAGE
 */
routes['POST /api/image/upload'] =                          'ImageController.upload';
routes['GET  /images/:size/:filename'] =                    'ImageController.serve';
routes['GET  /images/:filename'] =                          'ImageController.serve';


/**
 * ADMIN
 */
routes['GET    /api/:modelName/list/paged'] =                'GenericModelController.getPagedList';
routes['GET    /api/:modelName/list'] =                      'GenericModelController.getList';
routes['GET    /api/:modelName/get/:modelId'] =              'GenericModelController.getItem';
routes['POST   /api/:modelName/create'] =                    'GenericModelController.saveItem';
routes['PUT    /api/:modelName/update/:modelId'] =           'GenericModelController.saveItem';
routes['DELETE /api/:modelName/delete/multiple'] =           'GenericModelController.deleteMultiple';
routes['DELETE /api/:modelName/delete/:modelId'] =           'GenericModelController.deleteItem';
routes['POST   /api/:modelName/import'] =                    'GenericModelController.importMultiple';
routes['POST   /api/import/check'] =                         'ImportController.check';
routes['POST   /api/import/getCategoryObjects'] =            'ImportController.getCategoryObjects';


/**
 * OTHER
 */
// MailChimp
routes['POST   /api/mailchimp/subscribe/:list'] =             'MailChimpController.subscribe';


/**
 * MAIN ENTRIES
 */

routes['GET /admin*'] = (req, res) => {
  res.sendfile(path.join(__dirname, '../admin/dist/'));
};
routes['GET /*']      = (req, res) => {
  require(path.join(sails.config.sitePath, 'dist/index')).route(req, res)
};


module.exports.routes = routes;
