import React from 'react';
import {connect} from 'core/decorators';
import {Link} from 'react-router';
import {getFeaturedList, getTagList} from '../ArticleActions'
import {imageUrl} from 'core/utils/filters';
import {evalState} from 'core/utils/helpers';
import {setSsrRequired} from 'core/Main/MainActions';
import {I18n} from 'core/components/content';
import classnames from 'classnames';
import moment from 'moment';


@connect(state => ({
  featuredList: state.article.featuredList,
  tagList: state.article.tagList,
  activeTag: evalState('state.main.params.tagSlug', state)
}), {
  getFeaturedList,
  getTagList,
  setSsrRequired
})
export default class ArticleSidebar extends React.Component {

  componentWillMount() {
    const {setSsrRequired, featuredList, getFeaturedList, tagList, getTagList} = this.props;
    setSsrRequired(['article.featuredList', 'article.tagList']);
    if(!featuredList) getFeaturedList();
    if(!tagList) getTagList();
  }

  render() {
    const { featuredList, tagList, activeTag } = this.props;
    return (
      <ul className="sidebar">

        {/*<li ng-if="state.current.name != 'article.view'">*/}
          {/*<div className="article-search">*/}
            {/*<input type="text" className="form-control placeholder" ng-model="filter.s"*/}
                   {/*ng-enter="updateFilters()" placeholder={I18n.t('article.browse.searchPlaceholder')} />*/}
            {/*<button ng-if="filter.s" className="button-wire fa fa-times" ng-click="filter.s=null;updateFilters()"></button>*/}
            {/*<button className="article-search-button fa fa-search" ng-click="updateFilters()"></button>*/}
          {/*</div>*/}
        {/*</li>*/}

        {featuredList && (
          <li className="position-relative">
            <I18n.h2 value="article.featuredArticlesTitle"/>
            <hr/>
            {featuredList.length ? (
              <ul className="widget-articles">
                {featuredList.map(article=>(
                  <li key={article.id}>
                    <Link to={{name: 'ArticleView', params: {slug: article.slug}}}>
                      <img src={article && article.featuredImage ? imageUrl(article.featuredImage.filename, 'thumb') : require('../assets/article-placeholder-thumb.jpg')}
                           alt={`List image for ${article.name} article`}/>
                    </Link>
                    <h3>
                      <Link to={{name: 'ArticleView', params: {slug: article.slug}}}>{article.name}</Link>
                    </h3>
                    <h4>{moment(article.createdAt).format('DD MMM YYYY')}</h4>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-results">{I18n.t('article.noFeaturedArticles')}</p>
            )}
          </li>
        )}

        {tagList && (
          <li className="position-relative">
            <I18n.h2 value="article.tagListTitle"/>
            <hr/>
            {tagList.length ? (
              <ul className="widget-tags">
                {tagList.map(tag=>(
                  <li key={tag.slug} className={classnames({active: tag.slug === activeTag})}>
                    <Link to={{name: 'ArticleBrowseTag', params: {tagSlug: tag.slug}}}>{tag.name}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-results">{I18n.t('article.noTags')}</p>
            )}
          </li>
        )}

      </ul>
    )
  }

  getItemImage(article) {
    return article.featuredImage ? imageUrl(article.featuredImage.filename, 'thumb') : require('../assets/article-placeholder-thumb.jpg');
  }

}