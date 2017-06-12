const path = require('path');
const {host, port, publicUrl} = require(`./env/${process.env.NODE_ENV == 'production' ? 'production' : 'development'}.js`);

module.exports = {

  host,
  port,
  publicUrl,

  siteName: 'Site Starter',
  uploadsPath: path.join(__dirname, '../uploads')

};
