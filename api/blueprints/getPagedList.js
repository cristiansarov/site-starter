module.exports = function(req, res) {

  const {modelName, page, perPage, where} = req.params.all();
  const Model = sails.models[modelName.toLowerCase()];
  const model = HelperService.getParsedModelData(Model);

  const findQuery = Object.assign(
    model.config.list.defaultQuery || {},
    where ? JSON.parse(where) : {}
  );

  if(model.structure.list) findQuery.select = [model.config.primaryKey].concat(model.structure.list);

  Model.pagify('data', {
    findQuery: findQuery,
    // sort: ['id ASC'],
    populate: model.config.list.populate,
    page: page ? parseInt(page) : undefined,
    perPage: perPage ? parseInt(perPage) : undefined
  }).then(function(data){
    res.ok(data);
  }).catch(function(err){
    res.negotiate(err);
  });

};
