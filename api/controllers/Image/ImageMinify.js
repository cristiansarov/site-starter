const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpeg = require('imagemin-jpeg-recompress');
const imageminPng = require('imagemin-optipng');


module.exports = function(src, dest, quality) {
  if(!fs.existsSync(src)) return res.badRequest('There is no image on server to be minified.')
  if(!quality) quality = 100;
  return imagemin([src], dest, {
    use: [
      imageminJpeg({max: quality, method: 'smallfry'}),
      imageminPng({optimizationLevel: 4})
    ]
  });
};
