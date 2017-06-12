module.exports = {
  getParsedModelData: function(model) {

    if(!model.globalId) return;

    const modelName = model.globalId;
    const modelAttributes = Object.assign({}, model.attributes);
    const modelConfig = Object.assign({}, model.config);
    const modelStructure = Object.assign({}, model.structure);

    const modelData = {};

    // FIELDS
    modelData.fields = {};
    _.forEach(modelAttributes, function(data, fieldName) {
      if(fieldName == 'i18n') return;
      modelData.fields[fieldName] = {
        config: {
          list: data.config && data.config.list || {},
          edit: data.config && data.config.edit || {},
          importExport: data.config && data.config.importExport || {},
        },
        validation: _.clone(data) || {}
      };
      if(data.config) delete modelData.fields[fieldName].validation.config;
    });


    // CONFIG DEFAULTS
    modelData.config = modelConfig || {};
    const primaryKey = Object.keys(modelData.fields).filter(fieldName=>modelData.fields[fieldName].validation.primaryKey)[0];
    modelData.config.primaryKey = primaryKey;
    const defaultField = modelData.fields.name ? 'name' : modelData.config.primaryKey;
    if(!modelData.config.defaultField) modelData.config.defaultField = defaultField;
    if(!modelData.config.defaultParams) modelData.config.defaultParams = {};
    if(!modelData.config.crud) modelData.config.crud = {};
    if(!modelData.config.crud.create) modelData.config.crud.create = true;
    if(!modelData.config.crud.read) modelData.config.crud.read = true;
    if(!modelData.config.crud.update) modelData.config.crud.update = true;
    if(!modelData.config.crud.delete) modelData.config.crud.delete = true;
    if(!modelData.config.list) modelData.config.list = {};
    if(!modelData.config.list.template) modelData.config.list.template = 'default';
    if(!modelData.config.viewOnSite) modelData.config.viewOnSite = null;


    // STRUCTURE
    modelData.structure = modelStructure || {};
    if(!modelData.structure.list) modelData.structure.list = [defaultField];
    if(!modelData.structure.edit) modelData.structure.edit = [{fields: [defaultField]}];


    // I18N FIELDS INTO MAIN FIELDS
    if(modelData.config.hasI18n) {
      const Submodel = sails.models[modelName.toLowerCase()+'i18n'];
      const submodelData = this.getParsedModelData(Submodel);
      _.forEach(submodelData.fields, function(v, k) {
        if(['id', 'i18nParent', 'locale'].indexOf(k)>-1) return;
        v.config.isI18n = true;
        modelData.fields[k] = v;
      })
    }

    return modelData;

  },
  getPageData() {
    return new Promise((resolve, reject)=>{
      Page.query(`
      SELECT
      p.id,
      p.name,
      p.metaTitle,
      p.metaDescription,
      p.breadcrumbName,
      p.parent,
      p.slug,
      p.routeName,
      pt.componentName AS componentName,
      p.templateI18n,
      p.redirectTo,
      p.indexRouteName,
      pit.componentName AS indexComponentName,
      p.indexTemplateI18n,
      p.sitemapModel
      FROM page AS p
      LEFT JOIN pagetemplate AS pt ON p.template = pt.id 
      LEFT JOIN pagetemplate AS pit ON p.indexTemplate = pit.id
    `).then(pages=>{

        const i18nKeys = {};
        const pagesByParent = {};
        pages.forEach(page=>{
          const pageParent = page.parent || '-';
          pagesByParent[pageParent] = pagesByParent[pageParent] || [];
          if(page.routeName) {
            if(!['Layout', 'Home'].includes(page.routeName)) pagesByParent[pageParent].push(page);
            const i18nRouteName = page.routeName.charAt(0).toLowerCase() + page.routeName.slice(1);
            i18nKeys[i18nRouteName] = page.templateI18n ? JSON.parse(page.templateI18n) : {};
          }
          if(page.indexRouteName) {
            const i18nIndexRouteName = page.indexRouteName.charAt(0).toLowerCase() + page.indexRouteName.slice(1);
            i18nKeys[i18nIndexRouteName] = page.indexTemplateI18n ? JSON.parse(page.indexTemplateI18n) : {};
          }
        });

        const appRoutes = pagesByParent['-'].map(route=>constructRoute(route));

        resolve({appRoutes, i18nKeys});

        function constructRoute(route) {
          const newRoute = {
            path: route.slug,
            name: route.routeName,
            componentName: route.componentName,
            breadcrumbName: route.breadcrumbName
          };
          if(route.sitemapModel) {
            newRoute.sitemapModel = JSON.parse(route.sitemapModel);
          }
          if(route.redirectTo) {
            newRoute.redirectTo = route.redirectTo;
          }
          if(route.indexRouteName) {
            newRoute.indexRoute = {
              name: route.indexRouteName,
              componentName: route.indexComponentName,
              metaTitle: route.metaTitle,
              metaDescription: route.metaDescription
            }
          } else {
            newRoute.metaTitle = route.metaTitle;
            newRoute.metaDescription = route.metaDescription;
          }
          if(pagesByParent[route.id]) {
            newRoute.childRoutes = pagesByParent[route.id].map(route=>constructRoute(route));
          }
          return newRoute;
        }

      }).catch(reject);
    })
  }
};
