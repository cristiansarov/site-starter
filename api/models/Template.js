module.exports = {


  structure: {
    list: ['name', 'path'],
    edit: [
      {fields: ['name', 'path', 'i18nKeys']}
    ]
  },


  attributes: {

    name: {
      type: 'string',
      required: true,
      unique: true,
    },

    path: {
      type: 'string',
      required: true,
    },

    i18nKeys: {
      type: 'json',
      config: {
        edit: {
          template: 'json'
        }
      }
    }

  }


};
