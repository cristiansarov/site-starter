module.exports = function (req, res) {

  const {modelName, modelId} = req.params.all();

  const Model = sails.models[modelName.toLowerCase()];
  const modelConfig = HelperService.getParsedModelData(Model).config.edit || {};

  Model.findOne(modelId).populateAll().then(data => {
    res.ok(data);
  }).catch(err => {
    res.negotiate(err);
  });

};
