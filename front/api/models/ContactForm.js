module.exports = {

  config: {
    crud: {create: false}
  },

  structure: {
    list: ['name', 'email'],
    edit: [
      {fields: ['name', 'email', 'company', 'phone', 'message']}
    ]
  },

  attributes: {
    name: {
      type: 'string',
      required: true,
      config: {
        list: {readonly: true},
        edit: {readonly: true}
      }
    },
    email: {
      type: 'string',
      required: true,
      email: true,
      config: {
        list: {readonly: true},
        edit: {readonly: true}
      }
    },
    company: {
      type: 'string',
      config: {
        list: {readonly: true},
        edit: {readonly: true}
      }
    },
    phone: {
      type: 'string',
      config: {
        list: {readonly: true},
        edit: {readonly: true}
      }
    },
    message: {
      type: 'text',
      required: true,
      config: {
        edit: {template: 'textarea', readonly: true},
        view: {template: 'textarea'}
      }
    }
  }

};