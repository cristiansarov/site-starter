module.exports.default = function(req, res) {

  // SENDING THE XML
  res.setHeader('Content-type', 'text/plain');
  res.send(`User-agent: * \nSitemap: ${sails.config.publicUrl}/sitemap.xml`);

};
