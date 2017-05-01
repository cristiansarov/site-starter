module.exports = {

    config: {
        defaultField: 'filename',
        crud: {create: false}
    },

    structure: {
        list: ['filename', 'fileSize', 'extension'],
        edit: [
            {fields: ['filename', 'fileSize', 'extension']}
        ]
    },

    attributes: {
        filename: {
            type: 'string',
            required: true,
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
        extension: {
            type: 'string',
            required: true,
            config: {
                list: {},
                edit: {}
            }
        }
    },

    i18n: {
        en: {
            slug: 'files',
            singular: 'File',
            plural: 'Files'
        },
        ro: {
            slug: 'fisiere',
            singular: 'Fișier',
            plural: 'Fișiere'
        }
    },

    afterDestroy: function (destroyedFiles, cb) {
        var destroyedFile = destroyedFiles[0];
        if (!destroyedFile) return cb();
        var fs = require('fs');
        var path = require('path');
        var destroyedFilePath = path.join(sails.config.uploadsPath, destroyedFile.path);

        // destroy the phisical image from server if it exist
        fs.stat(destroyedFilePath, function(err) {
            if(!err) fs.unlink(destroyedFilePath);
        });

        cb();
    }

};

