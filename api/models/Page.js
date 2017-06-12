module.exports = {


  config: {
    edit: {
      populate: ['parent']
    }
  },


  structure: {
    list: ['name', 'slug', 'routeName', 'template'],
    edit: [
      {fields: ['name', 'metaTitle', 'slug', 'metaDescription', 'breadcrumbName', 'parent']},
      {tabName: 'Route', fields: ['routeName', 'template', 'templateI18n']},
      {tabName: 'IndexRoute', fields: ['indexRouteName', 'indexTemplate', 'indexTemplateI18n', 'redirectTo']},
      {tabName: 'Sitemap', fields: ['sitemapModel']}
    ]
  },


  attributes: {

    name: {
      type: 'string',
      required: true
    },

    metaTitle: {
      type: 'string',
      required: true,
      config: {
        edit: {build: {items: ['name']}}
      }
    },

    slug: {
      type: 'string',
      config: {
        edit: {template: 'slug', build: {items: ['name'], filter: 'toSlug'}}
      }
    },

    metaDescription: {
      type: 'string',
      required: true,
      config: {
        edit: {template: 'textarea'}
      }
    },

    breadcrumbName: {
      type: 'string',
      required: true,
      config: {
        edit: {build: {items: ['name']}}
      }
    },

    routeName: {
      type: 'string',
      unique: true
    },

    template: {
      model: 'pagetemplate',
      config: {
        edit: {template: 'select', model: 'PageTemplate'}
      }
    },

    templateI18n: {
      type: 'json',
      config: {
        edit: {template: 'jsonValues', target: 'template'}
      }
    },

    redirectTo: {
      type: 'string'
    },

    indexRouteName: {
      type: 'string',
      unique: true
    },

    indexTemplate: {
      model: 'pagetemplate',
      config: {
        edit: {template: 'select', model: 'PageTemplate'}
      }
    },

    indexTemplateI18n: {
      type: 'json',
      config: {
        edit: {template: 'jsonValues', target: 'indexTemplate'}
      }
    },

    sitemapModel: {
      type: 'json',
      config: {
        edit: {template: 'sitemapModel'}
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
