const imagemin = require('imagemin');
// const imageminMozjpeg = require('imagemin-mozjpeg');
// const imageminPngquant = require('imagemin-pngquant');


module.exports = function(src, dest, size) {
  if(!size) size = 100;
  return imagemin([src], dest, {
    plugins: [
      // imageminMozjpeg(),
      // imageminPngquant({quality: '65'})
    ]
  });
};
