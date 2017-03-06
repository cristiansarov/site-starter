module.exports = function(req, res) {

  const {modelName, page, perPage, where, populate} = req.params.all();
  const Model = sails.models[modelName.toLowerCase()];
  const modelConfig = HelperService.getParsedModelData(modelName.toLowerCase());

  Model.pagify('data', {
    findQuery: where ? JSON.parse(where) : undefined,
    // sort: ['id ASC'],
    populate: populate ? JSON.parse(populate) : undefined,
    page: page ? parseInt(page) : undefined,
    perPage: perPage ? parseInt(perPage) : undefined
  }).then(function(data){
    res.ok(data);
  }).catch(function(err){
    res.negotiate(err);
  });

};
