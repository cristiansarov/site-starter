module.exports = function (req, res) {

  const modelData = req.params.all();
  const modelName = modelData.modelName;
  const modelId = modelData.modelId;
  const Model = sails.models[modelName.toLowerCase()];
  delete modelData.modelName;
  delete modelData.modelId;
  const primaryKey = Object.keys(Model.attributes).filter(fieldName=>Model.attributes[fieldName].primaryKey)[0];

  const Request = req.method=='POST' ? Model.create(modelData) : Model.update(modelId, modelData);
  Request
    .then(response => {
      const modelId = req.method=='POST' ? response[primaryKey] : modelData[primaryKey];
      return Model.findOne(modelId).populateAll();
    })
    .then(item => {
      res.ok(item);
    })
    .catch(err => {
      res.negotiate(err);
    });

};
