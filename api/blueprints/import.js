module.exports = function (req, res) {

  const params = req.params.all();
  const Model = req._sails.models[params.modelName.toLowerCase()];

  Model.create(params.items).exec(function (err, createdItems) {
    if (err) return res.badRequest(err);
    return res.ok({successCount: createdItems.length});
  });

};
