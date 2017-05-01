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
      required: true
    },
    path: {
      type: 'string',
      required: true
    },
    fileSize: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    },
    extension: {
      type: 'string',
      required: true
    }
  },

  afterDestroy: function (destroyedFiles, cb) {
    const fs = require('fs');
    const path = require('path');
    destroyedFiles.forEach(file => {
      const filePath = path.join(sails.config.uploadsPath, file.path);
      fs.stat(filePath, function (err) { // destroy the phisical image from server if it exist
        if (!err) fs.unlink(filePath);
      });
    });
    cb();
  }

};

