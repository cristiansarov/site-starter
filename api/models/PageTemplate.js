module.exports = {

  config: {
    defaultField: 'componentName'
  },

  structure: {
    list: ['componentName'],
    edit: [
      {fields: ['componentName', 'i18nKeys']}
    ]
  },


  attributes: {

    componentName: {
      type: 'string',
      required: true,
      unique: true,
    },

    i18nKeys: {
      type: 'json',
      config: {
        edit: {template: 'jsonTemplate'}
      }
    }

  }


};
