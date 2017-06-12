var path = require('path');
var routes = {};

// CONTACT FORM
routes['POST /api/sendContactForm'] =        'ContactForm.sendContactForm';

// ARTICLE
routes['GET  /api/getPagedArticleList'] =    'ArticleController.getPagedList';
routes['GET  /api/getArticle/:slug'] =       'ArticleController.getArticle';
routes['GET  /api/getFeaturedArticleList'] = 'ArticleController.getFeaturedList';
routes['GET  /api/getTagList'] =             'ArticleTagController.getList';

// JOBS
routes['GET  /api/getPagedJobList'] =        'JobController.getPagedList';
routes['GET  /api/getJob/:slug'] =           'JobController.getJob';
routes['POST /api/signupForJob/:jobId'] =    'JobSignupController.signup';

module.exports.routes = routes;
