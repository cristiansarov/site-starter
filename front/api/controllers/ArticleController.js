const excerpt = require('../utils').excerpt;

module.exports = {
  getPagedList: function (req, res) {

    const {page = 1, perPage = 10, tagSlug} = req.params.all();

    const where = {
      status: 'published'
    };
    const promises = [];
    if(tagSlug) {
      promises.push(ArticleTag.query(`
        SELECT
          ata.article_tags AS id
        FROM articletag AS at
          LEFT JOIN article_tags__articletag_articles AS ata ON ata.articletag_articles = at.id
          WHERE at.slug = '${tagSlug}'
          AND ata.article_tags IS NOT NULL
      `))
    }

    Promise.all(promises).then(data => {
      if(data.length) where.id = data[0].map(i=>i.id);
      Article.pagify('list', {
        findQuery: {where},
        sort: ['publishedDate DESC'],
        populate: ['featuredImage', 'tags'],
        page: page ? parseInt(page) : undefined,
        perPage: perPage ? parseInt(perPage) : undefined
      }).then(function(data) {
        data.list.forEach(item=>{
          item.content = excerpt(item.content, 240);
        });
        res.ok(data);
      }).catch(function(err){
        res.negotiate(err);
      });
    })

  },

  getFeaturedList: function (req, res) {

    Article.find({
      where: {status: 'published', isFeatured: true},
      select: ['id', 'name', 'slug', 'featuredImage', 'publishedDate'],
      sort: 'publishedDate DESC',
      limit: 4
    }).populate('featuredImage').then(article => {
      res.ok(article);
    }).catch(res.negotiate)

  },

  getArticle: function (req, res) {
    const slug = req.params.slug;
    if (!slug) return res.badRequest('No article slug provided');
    Article.findOne({slug}).then(article => {
      if(!article) return res.notFound();
      Article.findOne({slug}).populateAll().then(article => {
        res.ok(article);
      })
    }).catch(res.negotiate);
  }
};