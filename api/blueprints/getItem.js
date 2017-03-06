module.exports = function (req, res) {

  const {modelName, modelId} = req.params.all();

  const Model = sails.models[modelName.toLowerCase()];

  Model.findOne(modelId).populateAll().then(data => {
    res.ok(data);
  }).catch(err => {
    res.negotiate(err);
  });

};
