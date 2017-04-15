const fs = require('fs');
const path = require('path');
const imageMinify = require('./ImageMinify');
const sharp = require('sharp');
const uploadsPath = typeof sails != 'undefined' ? sails.config.uploadsPath : '';


module.exports = function(res, imagePath, resizeName, cb) {
  if(!imagePath) return res.badRequest('Image resize: no image path provided');
  if(!sails.config.imageSizes[resizeName]) return res.badRequest('Image resize: the image size "'+resizeName+'" does not exists.');
  if(!fs.existsSync(path.join(uploadsPath, imagePath))) return res.badRequest('The original image has been removed from server.');

  const {width, height, crop, quality=100, watermark} = sails.config.imageSizes[resizeName];
  const extname = path.extname(imagePath);
  const fullImagePath = path.join(uploadsPath, imagePath);
  const resizeImagePath = imagePath.replace(extname, '-'+resizeName+extname);
  const resizeFullImagePath = fullImagePath.replace(extname, '-'+resizeName+extname);

  // create image resize object
  const image = sharp(fullImagePath).resize(width, height);

  // choose resize type
  if(crop) image.crop();
  else image.max();

  // output the object to file
  image.toFile(resizeFullImagePath, function (err) {
    if(err) return res.negotiate(err);

    // minify the file
    imageMinify(resizeFullImagePath, uploadsPath, quality).then(function () {

      // return the image path and size
      return cb(resizeImagePath, width + 'x' + height);
    })

  })

};
