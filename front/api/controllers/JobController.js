const excerpt = require('../utils').excerpt;

module.exports = {
  getPagedList: function (req, res) {

    const {page = 1, perPage = 10, isStudentLab = false} = req.params.all();

    const where = {
      status: 'published',
      isStudentLab: !!isStudentLab
    };

    Job.pagify('list', {
      findQuery: {where},
      sort: ['publishedDate DESC'],
      page: page ? parseInt(page) : undefined,
      perPage: perPage ? parseInt(perPage) : undefined
    }).then(function(data) {
      data.list.forEach(item=>{
        item.description = excerpt(item.description, 400);
      });
      res.ok(data);
    }).catch(function(err){
      res.negotiate(err);
    });

  },

  getJob: function (req, res) {
    const slug = req.params.slug;
    if (!slug) return res.badRequest('No job slug provided');
    Job.findOne({slug}).then(job => {
      if(!job) return res.notFound();
      Job.findOne({slug}).populateAll().then(job => {
        res.ok(job);
      })
    }).catch(res.negotiate);
  }

};