module.exports = function(req, res) {

  const {modelName, where, populate} = req.params.all();
  const Model = sails.models[modelName.toLowerCase()];

  Model.find({limit: -1}).then(function(data){
    res.ok(data);
  }).catch(function(err){
    res.negotiate(err);
  });

};
