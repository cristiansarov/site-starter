module.exports = {
  getList: function (req, res) {
    ArticleTag
      .query(`
        SELECT DISTINCT
          at.name,
          at.slug
        FROM articletag AS at
        LEFT JOIN article_tags__articletag_articles AS ata ON ata.articletag_articles = at.id
      `)
      .then(tags => {
        res.ok(tags);
      })
      .catch(res.negotiate);
  }
};