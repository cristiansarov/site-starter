/**
 * IMAGE SIZES
 * Used for image size regeneration
 * @structure { resizeName: {width, height, crop:true, quality:100, watermark:{top,left,path}} }
 * Watermark Images:
 * app/front/images/watermark.png | 170x70px
 */

module.exports.imageSizes = {
  thumbnail: {
    width: 300,
    height: 300,
    crop: true
  },
  thumb: {
    width: 100,
    height: 100,
    crop: true
  }
};
