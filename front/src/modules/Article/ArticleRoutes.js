import ArticleBrowse from './ArticleBrowseScreen';
import ArticleView from './ArticleViewScreen';

export default {
  name: 'Article',
  path: 'articles',
  component: props => props.children,
  indexRoute: {name: 'ArticleBrowse', component: ArticleBrowse, breadcrumbIgnore: true},
  childRoutes: [
    {
      name: 'ArticleBrowseTag',
      path: 'tag/:tagSlug',
      model: {name: 'articletag', param: 'tagSlug', dbParam: 'slug'},
      component: ArticleBrowse,
      breadcrumbResolve: state => `Tag: "${state.main.params.tagSlug}"`
    },
    {
      name: 'ArticleView',
      path: ':slug',
      model: {name: 'article', param: 'slug', dbParam: 'slug'},
      component: ArticleView,
      breadcrumbResolve: state => state.article.item && state.article.item.name
    }
  ]
}