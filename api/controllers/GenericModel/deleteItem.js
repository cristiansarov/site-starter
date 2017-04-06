module.exports = function(req, res) {

  const {modelName, modelId} = req.params.all();
  const Model = sails.models[modelName.toLowerCase()];

  if(!modelId) return res.badRequest();
  Model.destroy(modelId).exec(function(err) {
    if(err) return res.negotiate(err);
    res.ok();
  });

};
