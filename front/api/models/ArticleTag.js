module.exports = {

  structure: {
    list: ['name', 'slug', 'articles'],
    edit: [
      {fields: ['name', 'slug']}
    ]
  },

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    slug: {
      type: 'string',
      required: true,
      unique: true,
      config: {
        edit: {build: {items: ['name'], filter: 'toSlug'}}
      }
    },
    articles: {
      collection: 'article',
      via: 'tags',
      config: {
        list: {template: 'modelCount'}
      }
    }
  }

};

