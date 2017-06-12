import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router';
import { imageUrl } from 'core/utils/filters';
import moment from 'moment';
import ArticleSocial from '../ArticleSocial';
import ArticleImage from './ArticleItemImage';
import './ArticleItem.scss';


export default class ArticleItem extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };
  render() {
    const { article } = this.props;
    const { router } = this.context;
    const articleImage = article.featuredImage ? imageUrl(article.featuredImage.filename, 'list') : require('../../assets/article-placeholder-list.jpg');
    const articleUrl = typeof window !== 'undefined' ? window.location.origin.replace('https', 'http') + router.createHref({name: 'ArticleView', params: {slug: article.slug}}) : '';
    return (
      <li className="article">

        <div className="article-helper-white"><div/></div>
        <div className="article-helper-blue"><div/></div>

        <div className="article-meta">
          <h3>
            <Link to={{name: 'ArticleView', params: {slug: article.slug}}}>{article.name}</Link>
          </h3>
          <div className="article-date">
            <span>{moment(article.publishedDate).format('YYYY')}</span>
            <span>{moment(article.publishedDate).format('MMM')}</span>
            <span>{moment(article.publishedDate).format('DD')}</span>
          </div>
          <div className="article-author">
            <i className="icon-user"/>
            <span>Gentlab</span>
          </div>
        </div>

        <div className="row row-sm">
          <div className="col-xs-6">
            <Link to={{name: 'ArticleView', params: {slug: article.slug}}}>
              <ArticleImage src={articleImage}/>
            </Link>
          </div>
          <div className="col-xs-6">
            {!!article.tags.length && (
              <div className="article-tags">
                Tags:
                {article.tags.map((tag, k)=>(
                  <span key={k}>
                    <Link to={{name: 'ArticleBrowseTag', params: {tagSlug: tag.slug}}}>{tag.name}</Link>
                    {k !== article.tags.length-1 && ', '}
                  </span>
                ))}
              </div>
            )}
            <p>{article.content}</p>
            <div className="article-actions">
              <Link className="button" to={{name: 'ArticleView', params: {slug: article.slug}}}>{I18n.t('button.readMore')}</Link>
              <ArticleSocial url={articleUrl} title={article.name} description={article.content}/>
            </div>
          </div>
        </div>
      </li>
    )
  }
}