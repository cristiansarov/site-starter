module.exports = {

  structure: {
    list: ['display', 'key'],
    edit: [
      {fields: ['display', 'key']}
    ]
  },

  attributes: {
    display: {
      type: 'string',
      required: true,
    },
    key: {
      type: 'string',
      required: true,
      primaryKey: true,
      config: {
        edit: {build: {items: ['display'], filter: 'toCamelCase'}}
      }
    }
  },

  autoCreatedAt: false,
  autoUpdatedAt: false

};
