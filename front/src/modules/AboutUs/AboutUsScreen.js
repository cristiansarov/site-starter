import React, {Component} from 'react';
import {PageHeader, I18n} from 'core/components/content';
import './AboutUs.scss';


export default class AboutUsScreen extends Component {

  render() {
    return (
      <div>

        <PageHeader title="About Us" />

        <div className="content container">
          <h2>About US</h2>
          <p>Lorem ipsum</p>
          <p>Lorem ipsum</p>
          <hr/>

          {I18n.t('ArticleBrowse.Smecheras')}

          <h2>Team</h2>
          <p>Lorem Ipsum</p>
        </div>

      </div>
    );
  }
}