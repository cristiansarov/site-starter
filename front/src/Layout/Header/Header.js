import React from 'react';
import {Link} from 'react-router';
import {connect} from 'core/decorators';
import { openMenu } from 'core/Main/MainActions';
import {Navigation} from 'core/components/content';
import {mainMenu} from '../LayoutConstants';
import './Header.scss';


@connect(state=>({
  menuOpened: state.main.menuOpened,
  headerContent: state.main.headerContent
}), {
  openMenu
})
export default class Header extends React.Component {

  render() {
    const {openMenu} = this.props;
    return (
      <div>
        <div className="header">
          <div className="container">

            <button className="mobile-menu-button" onClick={openMenu}>Menu</button>

            <Link to="/" className="header-logo">
              <img src={require('./assets/logo-gentlab-white.svg')} alt="White Logo Gentlab" />
            </Link>

            <Navigation className="main-menu" links={mainMenu} />

          </div>
        </div>
        <div className="section-indent si-main-menu"><div className="container"><div /></div></div>
      </div>
    );
  }

}
