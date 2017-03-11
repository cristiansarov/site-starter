module.exports = {

  check: function (req, res) {

    const params = req.params.all();
    const Model = req._sails.models[params.model.toLowerCase()];
    const promises = [];
    const response = {unique: {}, submodel: {}};

    _.forEach(params.unique, function(data, fieldName) {
      const where = {};
      where[fieldName] = data;
      //console.log('where', where);
      promises.push(Model.find({where: where, select: [fieldName]}));
    });
    _.forEach(params.submodel, function(data, fieldName) {
      const submodelName = Model.attributes[fieldName].model;
      const selectedField = Model.attributes[fieldName].config.importExport.selectedField;
      const Submodel = req._sails.models[submodelName.toLowerCase()];
      const where = {};
      where[selectedField] = data;
      promises.push(Submodel.find({where: where}));
    });

    Promise.all(promises).then(function(responses) {
      let i = 0;
      _.forEach(params.unique, function(data, fieldName) {
        response.unique[fieldName] = [];
        responses[i].forEach(function(item) {
          response.unique[fieldName].push(item[fieldName]);
        });
        i++;
      });
      _.forEach(params.submodel, function(data, fieldName) {
        const selectedField = Model.attributes[fieldName].config.importExport.selectedField;
        responses[i].forEach(function(item) {
          if(data.indexOf(item[selectedField])>-1) data.splice(data.indexOf(item[selectedField]), 1);
        });
        response.submodel[fieldName] = data;
        i++;
      });
      res.ok(response);
    });

  },

  getCategoryObjects: function (req, res) {

    const params = req.params.all();
    const finalObjects = {};

    _.forEach(params, function (data, fieldName) {

      const Model = req._sails.models[data.model.toLowerCase()];
      const modelFields = HelperService.getParsedModelData(Model).fields;
      const selectedField = data.fieldName || 'name';
      finalObjects[fieldName] = [];

      // 1. Get all items with it's name
      const existentItems = [];
      const neededItems = [];
      const where = {};
      if(data.parent && data.parent.object && data.parent.object.slug && data.createIfNotFound && modelFields.slug) {
        const newItems = [];
        data.items.forEach(function(item) {
          newItems.push(data.parent.object.slug+'-'+titleToSlug(item));
        });
        where.slug = newItems;
      } else {
        where[selectedField] = data.items;
      }
      Model.find({where: where}).exec(function (err, foundItems) {
        if(err) return res.negotiate(err);

        foundItems.forEach(function (item) {
          existentItems.push(item[selectedField]);
          finalObjects[fieldName].push(item);
        });

        // 2. Get neededItems
        data.items.forEach(function (itemName) {
          if (existentItems.indexOf(itemName) == -1) {
            const item = {};
            let slugPrefix = '';
            item[selectedField] = itemName;

            if(data.parent && data.parent.object) {
              item[data.parent.fieldName] = data.parent.object.id;
              slugPrefix = data.parent.object.slug+'-';
            }
            // build slug
            if(modelFields.slug) item.slug = slugPrefix+titleToSlug(itemName);

            neededItems.push(item);
            //console.log('neededItems', neededItems)
          }
        });

        // 3. if there are neededItems, create them, if not, return final objects
        if(data.createIfNotFound && neededItems.length) {
          Model.create(neededItems).exec(function(err, createdItems) {
            if(err) return res.negotiate(err);
            createdItems.forEach(function (item) {
              finalObjects[fieldName].push(item);
            });
            return res.ok(finalObjects);
          });
        } else return res.ok(finalObjects);

      });
    });

  }

};

function titleToSlug(text) {
  return text.toLowerCase().replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i').replace(/ș/g, 's').replace(/ț/g, 't').replace(/[^\w ]+/g, '').replace(/ +/g, '-');
}
