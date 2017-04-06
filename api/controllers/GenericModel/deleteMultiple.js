module.exports = function(req, res) {

  const {modelName, ids} = req.params.all();
  const Model = sails.models[modelName.toLowerCase()];

  if(!(ids && ids.length)) return res.badRequest();
  Model.destroy({id: ids}).exec(function(err) {
    if(err) return res.negotiate(err);
    res.ok();
  });

};
