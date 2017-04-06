var path = require('path');
var sharp = require('sharp');
var $q = require('q');
var imageResize = require('./Image/ImageResize');
var imageMinify = require('./Image/ImageMinify');
var getOriginalFilename = require('./Image/getOriginalFilename');
var uploadsPath = typeof sails != 'undefined' ? sails.config.uploadsPath : '';


var updateModel = function (fileFields) {
  var defer = $q.defer();
  Image.create(fileFields).exec(function (err, fileObject) {
    if (err) return res.negotiate(err);
    defer.resolve(fileObject);
  });
  return defer.promise;
};

function generateImageObject(file, cb) {

  // Get the image object properties
  sharp(file.fd).toBuffer(function (err, buffer, image) {
    if (err) return res.negotiate(err);

    // get original filename (checks database)
    getOriginalFilename(file.filename, function (filename) {
      const extension = path.extname(file.fd).replace('.', '');
      const imagePath = file.fd.replace(uploadsPath, '');
      cb({
        filename: filename,
        path: imagePath,
        fileSize: file.size,
        resizeName: 'original',
        imageSize: image.width + 'x' + image.height,
        extension: extension
      })
    });
  });
}

module.exports = {

  upload: function (req, res) {

    // upload the image from request
    req.file('image').upload({
      dirname: uploadsPath,
      maxBytes: 10 * 1024 * 1024 // MB
    }, function (err, uploadedFiles) {
      if (err) return res.negotiate(err);
      if (uploadedFiles.length === 0) return res.badRequest('No file was uploaded');

      // generate database-ready image object from original image object
      const file = uploadedFiles[0];
      generateImageObject(file, function (fileFields) {

        // when the model is updated and the image is minified
        $q.all([
          updateModel(fileFields),
          imageMinify(file.fd, uploadsPath)
        ]).then(function (data) {

          // return the model received from database
          return res.ok(data[0]);
        })
      });
    });
  },

  serve: function (req, res) {

    var fileAdapter = require('skipper-disk')();
    var filename = req.param('filename');
    var resizeName = req.param('size') || 'original';
    var resizeConfig = sails.config.imageSizes[resizeName];


    // find original image first
    Image.findOne({filename: filename, resizeName: 'original'}).exec(function (err, originalImage) {
      if (err) return res.negotiate(err);
      if (!originalImage) return res.notFound('The filename requested is invalid'); // if the requested filename is invalid

      /**
       * Original size
       */
      if (resizeName == 'original') {
        fileAdapter

          // reads the file
          .read(path.join(uploadsPath, originalImage.path))

          // if the physical image doesn't exist
          .on('error', function () {
            return res.badRequest('The original image doesn\'t exist on server');
          })

          // if if it founds the image, pipe it
          .pipe(res);
      }

      /**
       * Other sizes
       */
      else {

        // Find the resized image on database
        Image.findOne({parentId: originalImage.id, resizeName: resizeName}).exec(function (err, image) {
          if (err) return res.negotiate(err);

          // if the image size is generated
          if (image) {

            // check if the image sizes are the same
            if (true && image.imageSize == resizeConfig.width + 'x' + resizeConfig.height) {
              fileAdapter
                .read(path.join(uploadsPath, image.path))
                .on('error', function () {

                  // if the file doesn't exist, generate the file again
                  imageResize(res, originalImage.path, resizeName, function (newImagePath, imageSize) {
                    fileAdapter.read(path.join(uploadsPath, newImagePath)).on('error', function (err) {
                      return res.serverError(err); // server error if the image has not been saved properly
                    }).pipe(res); // else pipe the image into result
                  });

                })
                .pipe(res);
            }

            // if not, resize, and update the image details in database
            else {
              console.log('resizing');
              imageResize(res, originalImage.path, resizeName, function (newImagePath, imageSize) {
                Image.update(image.id, {imageSize: imageSize}).exec(function (err) {
                  if (err) return res.negotiate(err);
                  fileAdapter.read(path.join(uploadsPath, newImagePath)).on('error', function (err) {
                    return res.serverError(err); // server error if the image has not been saved properly
                  }).pipe(res); // else pipe the image into result
                });
              });
            }
          }

          // if the image size is not generated and needs to be generated
          else {
            imageResize(res, originalImage.path, resizeName, function (newImagePath, imageSize) {
              var imageFields = {
                parentId: originalImage.id,
                resizeName: resizeName,
                path: newImagePath,
                imageSize: imageSize
              };
              Image.create(imageFields).exec(function (err) {
                if (err) return res.negotiate(err);
                fileAdapter.read(path.join(uploadsPath, newImagePath)).on('error', function (err) {
                  return res.serverError(err); // server error if the image has not been saved properly
                }).pipe(res); // else pipe the image into result
              });
            });
          }
        });
      }
    });
  }

};

