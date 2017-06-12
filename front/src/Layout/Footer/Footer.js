import React from 'react';
import {changeModalState} from 'core/Main/MainActions'
import {connect} from 'core/decorators';
import {Email, I18n} from 'core/components/content';
import './Footer.scss';
import Newsletter from './templates/FooterNewsletter';


@connect(null, {
  changeModalState
})
export default class Footer extends React.Component {

  socialLinks = [
    {icon: 'icon-twitter',      href: 'https://twitter.com/Gentlab_Romania'},
    {icon: 'icon-facebook',     href: 'https://www.facebook.com/Gentlab-144571138997399/'},
    {icon: 'icon-google-plus',  href: 'https://plus.google.com/104875645433690214064'},
    {icon: 'icon-linkedin',     href: 'https://www.linkedin.com/company-beta/2489281/'}
  ];

  render() {
    return (
      <div className="footer content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-md-push-3">
              <Newsletter />
              <div className="social-icons">
                {this.socialLinks.map((link, k)=>(
                  <a key={k} href={link.href} target="_blank"><i className={link.icon} /></a>
                ))}
                <div/>
              </div>
            </div>
            <div className="col-md-3 col-md-pull-6 col-sm-6 col-xs-6">
              <I18n.h3 value="footer.contact.title" />
              <ul className="footer-contact-details">
                <li>
                  <i className="icon-map-marker" />
                  <p>Bulevardul Eroii Sanitari 71, Sector 5, București</p>
                </li>
                <li>
                  <i className="icon-phone" />
                  <a href="tel:+40213672570">+40 21 367 25 70</a>
                </li>
                <li>
                  <i className="icon-envelope" />
                  <Email to="office@gentlab.com" />
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-6">
              <h3>{I18n.t('footer.coreProducts')}</h3>
              <a href="http://www.kinderunity.com/en?utm_source=Gentlab&utm_medium=Footer&utm_campaign=Logo" className="footer-logo">
                <img src={require('./assets/logo-kinderunity-white-full.svg')} alt="White Kinderunity logo"/>
                <img src={require('./assets/logo-kinderunity-white.svg')} alt="Kinderunity logo"/>
              </a><br/>
              <a href="http://www.knolyx.com/en?utm_source=Gentlab&utm_medium=Footer&utm_campaign=Logo" className="footer-logo">
                <img src={require('./assets/logo-knolyx-white-full.svg')} alt="White Knolyx logo"/>
                <img src={require('./assets/logo-knolyx-white.svg')} alt="Knolyx logo"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  openModal() {
    this.props.changeModalState({modalOpened: true});
  }

}