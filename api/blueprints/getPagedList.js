module.exports = function(req, res) {

  const {modelName, page, perPage, sort, where} = req.params.all();
  const Model = sails.models[modelName.toLowerCase()];
  const model = HelperService.getParsedModelData(Model);

  const findQuery = Object.assign(
    model.config.list.defaultQuery || {},
    {where: where ? JSON.parse(where) : {}}
  );

  Object.keys(findQuery.where).forEach(function (key) {
    if(model.fields[key]) {
      const config = model.fields[key].config;
      if([undefined].includes(config.list.template)) {
        findQuery.where[key] = {like: `%${findQuery.where[key]}%`}
      } else if('boolean'==config.list.template && ['true', 'false'].includes(findQuery.where[key])) {
        findQuery.where[key] = JSON.parse(findQuery.where[key]);
      }
    }
  });

  if(model.structure.list) findQuery.select = [model.config.primaryKey].concat(model.structure.list);


  Model.pagify('data', {
    findQuery: findQuery,
    sort: sort ? sort.split(',') : undefined,
    populate: model.config.list.populate,
    page: page ? parseInt(page) : undefined,
    perPage: perPage ? parseInt(perPage) : undefined
  }).then(function(data){
    res.ok(data);
  }).catch(function(err){
    res.negotiate(err);
  });

};
