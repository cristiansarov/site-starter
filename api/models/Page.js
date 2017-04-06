module.exports = {


  config: {
    defaultField: 'title',
    edit: {
      populate: ['parent']
    }
  },


  structure: {
    list: ['title', 'slug', 'routeName', 'template'],
    edit: [
      {fields: ['title', 'slug', 'routeName', 'wrapperRouteName', 'template', 'metaDescription', 'parent']}
    ]
  },


  attributes: {

    title: {
      type: 'string',
      required: true
    },

    slug: {
      type: 'string',
      required: true,
      config: {
        edit: {template: 'slug', build: {items: ['title'], filter: 'toSlug'}}
      }
    },

    routeName: {
      type: 'string',
      unique: true
    },

    wrapperRouteName: {
      type: 'string',
      unique: true
    },

    template: {
      model: 'template',
      required: true,
      config: {
        edit: {template: 'select', model: 'Template'}
      }
    },

    templateI18n: {
      type: 'json'
    },

    metaDescription: {
      type: 'string',
      config: {
        edit: {template: 'textarea'}
      }
    },

    parent: {
      model: 'page',
      config: {
        edit: {template: 'select', model: 'Page'}
      }
    }

  }


};
