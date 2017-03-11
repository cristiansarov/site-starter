import React, { Component } from 'react';
import Header from './Header/HeaderComponent';
import Footer from './Footer/FooterComponent';

require('./Layout.scss');

export default class LayoutComponent extends Component {
  render() {
    return (
      <div className="layout">
        <Header />
        {/* <Breadcrumbs routes={this.props.routes} className="container breadcrumbs" /> */}
        <div className="container">
          <div className="layout__content">{this.props.children}</div>
        </div>
        <Footer />
      </div>
    );
  }
}
