import React from 'react';
const BurgerMenu = require('react-burger-menu').push;
import {Navigation} from 'core/components/content';
import {connect} from 'core/decorators';
import {closeMenu, openMenu, renderMenu} from 'core/Main/MainActions';
import classnames from 'classnames';
import {mainMenu} from '../LayoutConstants';
import './MobileMenu.scss';


@connect(state=>({
  opened: state.main.menuOpened,
  rendered: state.main.menuRendered,
  router: state.main.router
}), {
  closeMenu,
  openMenu,
  renderMenu
})
export default class MobileMenu extends React.Component {
  componentWillMount() {
    this.removeListener = this.props.router.listen(()=>this.props.closeMenu())
  }
  componentWillReceiveProps({opened, rendered, renderMenu, openMenu}) {
    if(!rendered && opened) {
      renderMenu();
      setTimeout(openMenu);
    }
  }
  handleStateChange(state) {
    if(!state.isOpen) this.props.closeMenu();
  }
  render() {
    const {opened, rendered} = this.props;
    if(!rendered) return null;
    return (
      <div className={classnames({'menu-opened': opened})}>
        <BurgerMenu pageWrapId="main" outerContainerId="app" isOpen={opened} onStateChange={this.handleStateChange.bind(this)}>
          <Navigation links={mainMenu} />
        </BurgerMenu>
      </div>
    );
  }
  componentWillUnmount() {
    this.removeListener();
  }
}