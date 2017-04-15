module.exports = {

    config: {
        defaultField: 'filename',
        crud: {create: false},
        list: {
            template: 'image',
            defaultQuery: {
              resizeName: 'original'
            }
        }
    },

    structure: {
        list: ['filename', 'fileSize', 'imageSize', 'extension'],
        edit: [
            {fields: ['filename', 'fileSize', 'imageSize', 'extension']}
        ]
    },

    attributes: {
        filename: {
            type: 'string',
            //required: true,
            config: {
                list: {},
                edit: {}
            }
        },
        path: {
            type: 'string',
            required: true
        },
        fileSize: {
            type: 'string',
            //required: true,
            config: {
                list: {},
                edit: {}
            }
        },
        imageSize: {
            type: 'string',
            required: true,
            config: {
                list: {},
                edit: {}
            }
        },
        resizeName: {
            type: 'string',
            required: true
        },
        extension: {
            type: 'string',
            //required: true,
            config: {
                list: {},
                edit: {}
            }
        },
        parentId: {
            type: 'int'
        }
    },

    i18n: {
        en: {
            slug: 'images',
            singular: 'Image',
            plural: 'Images'
        },
        ro: {
            slug: 'imagini',
            singular: 'Imagine',
            plural: 'Imagini'
        }
    },

    afterDestroy: function (destroyedImages, cb) {
        var destroyedImage = destroyedImages[0];
        var $q = require('q');
        var fs = require('fs');
        var path = require('path');
        var destroyedImagePath = path.join(sails.config.uploadsPath, destroyedImage.path);

        // destroy the phisical image from server if it exist
        fs.stat(destroyedImagePath, function(err) {
            if(!err) fs.unlink(destroyedImagePath);
        });

        // is is an image size, return cb
        if(destroyedImage.parentId) return cb();

        // find all image sizes and delete them
        Image.find({where: {parentId: destroyedImage.id}}).then(function(imageSizes) {
            var promises = [];
            imageSizes.forEach(function(imageSize) {
                promises.push(Image.destroy({id: imageSize.id}));
            });
            $q.all(promises).then(function() {
                return cb();
            })
        });
    }

};

