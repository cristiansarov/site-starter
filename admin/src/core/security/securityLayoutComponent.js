import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';

require('./security.scss');

export default class securityLayout extends Component {
  render() {
    return (
      <section className="page-login">
        <div className="row">
          <div className="col-md-7 col-sm-6">
            <div className="pl-circle-bg"><img src={require('./assets/login-bg.svg')} alt=""/></div>
            <div className="pl-left">
              <div>
                <h1>{I18n.t('login.welcomeTitle')}</h1>
                <img src={require('../../Main/Layout/Header/assets/logo.png')} />
              </div>
            </div>
          </div>
          <div className="col-md-5 col-sm-6">
            <div className="pl-right">{this.props.children}</div>
          </div>
        </div>
      </section>
    )
  }
}
