module.exports = {

  config: {
    list: {
      populate: ['featuredImage']
    }
  },

  structure: {
    list: ['featuredImage', 'name', 'status'],
    edit: [
      {fields: ['name', 'slug', 'content', 'metaDescription']},
      {tabName: 'Meta', fields: ['publishedDate', 'tags', 'status', 'featuredImage']}
    ]
  },

  attributes: {
    name: {
      type: 'string',
      required: true,
      config: {
        list: {},
        edit: {}
      }
    },
    slug: {
      type: 'string',
      required: true,
      unique: true,
      config: {
        edit: {build: {items: ['name'], filter: 'toSlug'}}
      }
    },
    content: {
      type: 'text',
      required: true,
      config: {
        edit: {template: 'wysiwyg'}
      }
    },
    metaDescription: {
      type: 'text',
      config: {
        edit: {template: 'textarea'}
      }
    },
    featuredImage: {
      model: 'Image',
      config: {
        list: {template: 'image', icon: 'fa fa-picture-o', style: {width: 50, textAlign: 'center'}},
        edit: {template: 'image', model: 'Image'}
      }
    },
    tags: {
      collection: 'articletag',
      via: 'articles',
      dominant: true,
      config: {
        list: {template: 'modelList'},
        edit: {template: 'multiselect', model: 'ArticleTag'}
      }
    },
    status: {
      type: 'string',
      enum: ['draft', 'published'],
      defaultsTo: 'draft',
      config: {
        list: {template: 'choice'},
        edit: {template: 'select', options: ['draft', 'published'], defaultValue: 'draft'}
      }
    },
    isFeatured: {
      type: 'boolean',
      config: {
        list: {
          template: 'boolean',
          icon: 'fa fa-star-o',
          booleanIcon: 'fa fa-star',
          style: {width: 50, textAlign: 'center'}
        },
        edit: {
          template: 'checkbox',
          checkLabel: 'Is Featured',
          description: 'Featured means that it will appear on the home page.'
        }
      }
    },
    publishedDate: {
      type: 'date',
      config: {
        list: {template: 'date'},
        edit: {template: 'date'}
      }
    }
  }

};

