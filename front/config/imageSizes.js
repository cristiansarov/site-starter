/**
 * IMAGE SIZES
 * Used for image size regeneration
 * @structure { resizeName: {width, height, crop:true, quality:100, watermark:{top,left,path}} }
 * Watermark Images:
 * app/front/images/watermark.png | 170x70px
 */

module.exports.imageSizes = {
  featured: {
    width: 1500,
    height: 450,
    quality: 80,
    crop: true
  },
  list: {
    width: 700,
    height: 400,
    crop: true,
    quality: 90
  }
};