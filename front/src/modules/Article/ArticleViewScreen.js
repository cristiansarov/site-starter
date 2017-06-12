import React from 'react';
import {Link} from 'react-router';
import {getItem, resetItem} from './ArticleActions';
import {connect} from 'core/decorators';
import NotFound from 'Layout/NotFound/NotFoundComponent';
import {imageUrl} from 'core/utils/filters';
import {setSsrRequired, setMetaTags} from 'core/Main/MainActions';
import moment from 'moment';
import {PageHeader, CodeHighlighter} from 'core/components/content';
import ArticleSocial from './templates/ArticleSocial';
import ArticleImage from './templates/Item/ArticleItemImage';


@connect((state, props)=> ({
  article: state.article.item,
  slug: props.params.slug
}), {
  getItem,
  resetItem,
  setMetaTags,
  setSsrRequired
})
export default class ArticleViewScreen extends React.Component {

  componentWillMount() {
    const { setMetaTags, setSsrRequired, slug, getItem } = this.props;
    setSsrRequired(['article.item'], {notFoundState: 'article.item.notFound'});
    getItem(slug).then(response=>{
      const article = response.value.data;
      setMetaTags({
        title: article.name,
        description: article.metaDescription,
        image: article.featuredImage && imageUrl(article.featuredImage.filename, 'list'),
        type: 'article'
      });
    });
  }

  render() {
    const {article} = this.props;
    if (article && article.notFound) return <NotFound />;
    const articleImage = article && (article.featuredImage ? imageUrl(article.featuredImage.filename, 'featured') : require('./assets/article-placeholder-featured.jpg'));
    return (
      <div>

        {article && (
          <PageHeader title={article.name} />
        )}

        <div className="content">
          <div className="container">
            <div className="layout">
              {article && (
                <div className="main">

                  <div className="article article-view-image-container">
                    <div className="article-helper-white">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84.6 128"><polygon points="0,0 84.6,0 45.2,128 0,128 " /></svg>
                    </div>
                    <div className="article-helper-blue">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84.6 128"><polygon points="0,0 84.6,0 45.2,128 0,128 "/></svg>
                    </div>

                    <div className="article-meta">
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

                    <ArticleImage src={articleImage} straight/>
                  </div>

                  <div className="article-content">
                    <CodeHighlighter>{article.content}</CodeHighlighter>

                    {!!article.tags.length && (
                      <div className="article-tags">
                        Tags: {article.tags.map((tag, k)=>(
                          <span key={k}>
                            <Link to={{name: 'ArticleBrowseTag', params: {tagSlug: tag.slug}}}>{tag.name}</Link>
                            {k !== article.tags.length-1 && ', '}
                          </span>
                        ))}
                      </div>
                    )}

                    <ArticleSocial url={typeof window !== 'undefined' ? window.location.href.replace('https', 'http') : ''}  title={article.name} description={article.content} big/>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    );
  }

  componentWillUnmount() {
    this.props.resetItem();
  }

}