const getOriginalFilename = require('./utils/getOriginalFilename');
const path = require('path');


module.exports = {
  uploadFile: function(req, Model, filename) {
    return new Promise((resolve, reject)=>{
      const uploadsPath = sails.config.uploadsPath;

      // 1. UPLOAD THE FILE
      req.file(filename).upload({
        dirname: uploadsPath,
        maxBytes: 10 * 1024 * 1024 // MB
      }, function (err, uploadedFiles) {
        if (err) return reject(err);
        if (uploadedFiles.length === 0) return reject('No file was uploaded');

        // 2. GENERATE DATABASE-READY OBJECT
        const file = uploadedFiles[0];
        getOriginalFilename(Model, file.filename, function (filename) {
          const extension = path.extname(file.fd).replace('.', '');
          const fileFields = {
            filename: filename,
            path: file.fd.replace(uploadsPath, ''),
            fileSize: file.size,
            extension: extension
          };

          // 3. CREATE THE MODEL ITEM FROM OBJECT
          Model.create(fileFields).then(function (data) {
            return resolve(data); // return the model received from database
          })
        });
      });
    })
  }
};