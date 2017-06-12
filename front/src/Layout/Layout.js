import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import MobileMenu from './MobileMenu/MobileMenu';
import './Layout.scss';


export default class Layout extends React.Component {
  render() {
    const {children} = this.props;
    return (
      <div className="main-container">
        <MobileMenu />
        <div id="main">
          <Header />
          {children}
          <Footer />
        </div>
      </div>
    );
  }
}