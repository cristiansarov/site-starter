import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Breadcrumbs} from 'core/components/content';
import './PageHeader.scss';

export default class PageHeaderComponent extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    hideBreadcrumbs: PropTypes.bool
  };

  render() {
    const {title, hideBreadcrumbs} = this.props;
    return (
      <div className="page-header">
        <div className="container">
          <h1>{title}</h1>
          {!hideBreadcrumbs && <Breadcrumbs />}
        </div>
      </div>
    )
  }

}