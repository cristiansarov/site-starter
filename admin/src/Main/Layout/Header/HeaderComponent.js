import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Navigation} from 'ContentComponents';
import { Link } from 'react-router';
import {getMainMenu} from '../../MainActions';

require('./Header.scss');

@connect(state => ({
  currentUser: state.security.currentUser,
  mainMenu: state.main.mainMenu
}), {
  getMainMenu
})
export default class HeaderComponent extends Component {
  componentWillMount() {
    this.props.getMainMenu();
  }
  render() {

    const { currentUser, mainMenu } = this.props;

    const userMenu = [
      {display: currentUser.fullName, route: {name: 'MyAccount'}, subitems: [
        {display: 'Profile', route: {name: 'MyAccount'}},
        {display: 'Logout', route: {name: 'Logout'}}
      ]}
    ];

    return (
      <div>

        <section className="header-top">
          <div className="container">
            <div className="logo">
              Administration Panel
            </div>
            <div className="account">
              <Navigation links={userMenu} />
            </div>
          </div>
        </section>

        <section className="header-navigation">
          <div className="container">
            <Navigation links={mainMenu} />
          </div>
        </section>

      </div>
    );

  }
}
