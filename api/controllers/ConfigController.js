const getData = require('./Config/getData');

module.exports = {
  getMainConfig: function (req, res) {
    const routes = [];
    _.forEach(sails.models, function (model) {
      if(!model.globalId) return;
      routes.push({name: model.globalId});
    });
    res.jsVariable('mainConfig', {routes});
  },
  models: function (req, res) {
    const models = {};
    const modelsArr = [];
    _.forEach(sails.models, function (model) {
      if(!model.globalId) return;
      models[model.globalId] = HelperService.getParsedModelData(model);
      modelsArr.push(HelperService.getParsedModelData(model));
    });
    res.json(models);
  },
  mainMenu: function (req, res) {
    const mainMenu = [];
    const sidebarMenuMap = {};
    _.forEach(sails.models, function (model) {
      const modelName = model.globalId;
      if(!modelName) return;
      mainMenu.push({translate: `menu.${modelName}`, route: {name: 'Model', params: {modelName}}});
    });
    res.json(mainMenu);
  },
  getData
};


