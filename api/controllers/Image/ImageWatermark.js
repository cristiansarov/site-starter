module.exports = function(watermark, image) {
  var defer = $q.defer();
  // check if all required watermark object properties exist
  if(watermark && (watermark.top>=0 || watermark.bottom>=0) && (watermark.left>=0 || watermark.right>=0) && watermark.path) {

    // open watermark image
    lwip.open(path.join(sails.config.appPath, watermark.path), function(err, watermarkImage) {
      if(err) return defer.reject('Watermark image cannot be opened.');

      if(watermark.bottom>=0) {
        var wiHeight = watermarkImage.height();
        var iHeight = image.height();
        watermark.top = iHeight - wiHeight - watermark.bottom;
      }

      if(watermark.right>=0) {
        var wiWidth = watermarkImage.width();
        var iWidth = image.width();
        watermark.left = iWidth - wiWidth - watermark.right;
      }

      // paste the watermark image on top of the original one
      image.paste(watermark.left, watermark.top, watermarkImage, function(err, finalImage) {
        if(err) return defer.reject('The image failed to be watermarked.');
        defer.resolve(finalImage);
      });
    });
  } else defer.resolve(image);
  return defer.promise;
};
