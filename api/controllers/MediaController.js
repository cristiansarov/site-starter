var utils = require('../services/utils/utils');

module.exports = {

    checkIfExists: function(filename, cb) {
        Media.findOne({filename: filename}).then(function(item) {
            cb(item ? true : false);
        })
    },

    getOriginalFilename: function(filename, cb) {
        var checkIfExists = this.checkIfExists;
        var getOriginalFilename = this.getOriginalFilename;
        checkIfExists(filename, function(exists) {
            if(exists) {
                filename = utils.riseCopyIndex(filename);
                getOriginalFilename(filename, cb)
            } else cb(filename);
        })
    },

    upload: function(req, res) {

        var uploadPath = sails.config.appPath+'/uploads';
        var path = require('path');
        var getOriginalFilename = this.getOriginalFilename;

        // UPLOAD THE FILE TO AMAZON
        req.file('file').upload({
            dirname: uploadPath,
            maxBytes: 5 * 1024 * 1024 // MB
        },function (err, uploadedFiles) {
            if (err) {
                if(err.code == "E_EXCEEDS_UPLOAD_LIMIT") return res.badRequest(err);
                return res.negotiate(err);
            }
            if (uploadedFiles.length === 0) return res.badRequest('No file was uploaded');
            var file = uploadedFiles[0];
            var extension = path.extname(file.fd).replace('.', '');
            var imagePath = file.fd.replace(uploadPath, '');


            getOriginalFilename(file.filename, function(filename) {
                var fileFields = {
                    filename: filename,
                    path: imagePath,
                    fileSize: file.size,
                    extension: extension
                };
                updateModel(fileFields);
            });
        });

        // UPDATE THE VIDEO
        var updateModel = function(fileFields) {
            Media.create(fileFields).exec(function(err, fileObject) {
                if (err) return res.negotiate(err);
                return res.ok(fileObject);
            });
        };

    },
    serve: function(req, res) {
        var fileAdapter = require('skipper-disk')();
        var path = require('path');
        var mediaId = req.param('id');
        Media.findOne(mediaId).exec(function(err, file) {
            if(err) return res.negotiate(req);
            if(!file) return res.badRequest({message: 'The image was not found'});
            var fullImagePath = path.join(sails.config.appPath, 'uploads', file.path);
            res.setHeader('Content-Disposition', 'inline; filename="'+file.filename+'"');
            fileAdapter.read(fullImagePath).on('error', function (err){ return res.serverError(err); }).pipe(res);
        });
    }

};
