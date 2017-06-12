import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'core/decorators';
import { getPagedList } from './ArticleActions'
import { listenToLocation } from 'core/utils/helpers';
import { I18n } from 'react-redux-i18n'
import {PageHeader, Link, Pagination} from 'core/components/content';
import ArticleItem from './templates/Item/ArticleItem';
import Sidebar from './templates/ArticleSidebar';
import './Article.scss';
import {setSsrRequired, setMetaTags} from 'core/Main/MainActions';


@connect(state => ({
  articleList: state.article.list,
  totalPages: state.article.totalPages,
  loading: state.article.loading
}), {
  getPagedList,
  setSsrRequired,
  setMetaTags
})
export default class ArticleBrowseScreen extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    const {setSsrRequired} = this.props;
    setSsrRequired(['article.list', 'article.totalPages']);
    this.getItemList();
    this.unlistenToLocation = listenToLocation(() => {
      this.getItemList();
    }, this);
  }

  getItemList() {
    const { getPagedList, params, location: {query}, setMetaTags } = this.props;
    const requestParams = {...query, ...params};
    getPagedList(requestParams).then(() => {
      setMetaTags({
        title: I18n.t(`article.browse.${params.tagSlug ? 'titleTag' : 'title'}`, {tag: params.tagSlug && params.tagSlug.replace(/(?:-)/g, ' ')})
        // description: I18n.t('article.browse.metaDescription')
      });
    });
  }


  render() {
    const { articleList, totalPages, params: {tagSlug} } = this.props;
    return (
      <div>

        <PageHeader title="Article List" />

        <div className="container margin-top-40 margin-bottom-80">
          <div className="layout">
            <div className="main">

              {tagSlug && (
                <div className="article-filter">
                  <span>Tags:</span>
                  <ul>
                    <li>
                      <span>TAG:</span>
                      <strong>{tagSlug.replace(/(?:-)/g, ' ')}</strong>
                      <Link to={{name: 'ArticleBrowse'}} className="button-wire icon-times-circle" />
                    </li>
                  </ul>
                </div>
              )}

              {articleList && (articleList.length ? (
                  <ul className="article-list">
                    {articleList.map(article=>(
                      <ArticleItem key={article.id} article={article} />
                    ))}
                  </ul>
                ) : (
                  <h2 className="text-center">{I18n.t('article.browse.noArticles')}</h2>
                ))}

              <div className="text-center">
                <Pagination totalPages={totalPages} />
              </div>

            </div>

            <Sidebar/>

          </div>
        </div>

      </div>
    );
  }

  componentWillUnmount() {
    this.unlistenToLocation();
  }

}