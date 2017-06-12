import React from 'react';
import PropTypes from 'prop-types';
import {ShareButtons} from 'react-share';
import classnames from 'classnames';
import {excerpt} from 'core/utils/filters';
const {FacebookShareButton, GooglePlusShareButton, LinkedinShareButton, TwitterShareButton} = ShareButtons;

export default class ArticleSocial extends React.Component {
  static propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    big: PropTypes.bool
  };
  socialShares = [
    {icon: 'icon-facebook', Component: FacebookShareButton},
    {icon: 'icon-linkedin', Component: LinkedinShareButton},
    {icon: 'icon-twitter', Component: TwitterShareButton},
    {icon: 'icon-google-plus', Component: GooglePlusShareButton}
  ]

  render() {
    const {url, title, description, big} = this.props;
    return (
      <div className={classnames('article-social', {big})}>
        { this.socialShares.map((i, k) => (
          <i.Component key={k}
                       url={url}
                       title={title}
                       description={excerpt(description, 200)}><i className={i.icon}/></i.Component>
        )) }
      </div>
    )
  }
}