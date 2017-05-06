const generateXmlLine = function (url, frequency, priority) {
  if (typeof url === 'undefined') return;
  if (!frequency) frequency = 'monthly';
  if (!priority) priority = '1.0';
  return '<url><loc>' + url + '</loc><changefreq>' + frequency + '</changefreq><priority>' + priority + '</priority></url>';
};


module.exports.default = function (req, res, next) {
  if(!(sails.config.sitemap && sails.config.sitemap.routes)) return next();


  const routes = sails.config.sitemap.routes;
  const baseUrl = sails.config.publicUrl;
  const routeModelItems = {};
  const path = require('path');
  const applyParams = require('react-router-sitemap').paramsApplier;


  // Get model routes
  const routeModels = [];
  routes.forEach(function(route) {
    findRouteModels(route);
  });
  function findRouteModels(route) {
    if(route.model) routeModels.push(route.model);
    if(route.childRoutes) route.childRoutes.forEach(function (route) {
      findRouteModels(route);
    });
  }


  // If there route models, get the data, then generate and send
  let output = '';
  if(routeModels.length) {
    Promise.all(routeModels.map(function(model) {
      return sails.models[model.name].find({select: [model.dbParam], where: model.where || {}, limit: 9999});
    })).then(function(data) {
      data.forEach(function(items, k) {
        routeModelItems[routeModels[k].name] = items.map(item => {
          const {param, dbParam} = routeModels[k];
          return {[param]: item[dbParam]};
        });
      });
      generateAndSend();
    });
  } else generateAndSend(); // else just generate and send
  function generateAndSend() {

    // Start Generating
    output += generateXmlLine(baseUrl);
    routes.forEach(function(route) {
      generateXml(baseUrl, route);
    });

    // Generate XML Loop function
    function generateXml(baseUrl, route) {
      if(!route.model) { // if there is static url
        const url = baseUrl+'/'+route.path;
        if(route.path!='*') {
          output += generateXmlLine(url);
        }
        if(route.childRoutes) route.childRoutes.forEach(function (route) {
          generateXml(url, route);
        });
      } else { // if there is a model url
        var applyConfig = {[route.path]: JSON.parse(JSON.stringify(routeModelItems[route.model.name])) };
        applyParams([route.path], applyConfig).forEach(function(url) {
          if(url!='*') {
            output += generateXmlLine(baseUrl+'/'+url);
          }
        });
      }
    }

    // Send the XML
    res.setHeader('Content-type', 'text/xml');
    res.send('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + output + '</urlset>');

  }
};
