import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router';
import classNames from 'classnames';

require('./Navigation.scss');

export default class NavigationComponent extends Component {
  renderItem(items) {
    return (
      items.map((item, k) => {
        if(typeof item.if !== 'undefined' && !item.if) return null;
        var Element;
        var props = {};
        if(item.route) {
          Element = Link;
          props.to = item.route;
          props.activeClassName = 'active';
        } else {
          Element = 'a';
          if(item.href) props.href = item.href;
          else if(item.click) props.onClick = item.click;
        }
        return (
          <li key={k} className={classNames(item.class, {'has-submenu': item.subitems})}>
            <Element {...props}>
              { item.icon && <i className={classnames('menu-icon', item.icon)} /> }
              <span>{ item.translate ? I18n.t(item.translate) : item.display }</span>
              { item.subitems && <span className="menu-arrow" /> }
            </Element>
            { item.subitems && <ul className="submenu">{this.renderItem(item.subitems)}</ul> }
          </li>
        );
      })
    );
  }
  render() {
    const {links} = this.props;
    if(!links) return null;
    return <ul className="navigation">{this.renderItem(links)}</ul>;
  }
}
