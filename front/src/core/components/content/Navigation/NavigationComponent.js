import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router';
import classnames from 'classnames';
import './Navigation.scss';

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
          else if(item.onClick) props.onClick = item.onClick;
        }
        
        return (
          <li key={k} className={classnames(item.class, {'has-submenu': item.children})}>
            <Element key={k} {...props}>
              { item.icon && <i className={classnames('menu-icon', item.icon)} /> }
              <span>{ item.translate ? I18n.t(item.translate) : item.display }</span>
              { item.children && <span className="menu-arrow" /> }
            </Element>
            { item.children && <ul className="submenu">{this.renderItem(item.children)}</ul> }
          </li>
        );
      })
    );
  }
  render() {
    const {links, className, vertical} = this.props;
    if(!links) return null;
    return <ul className={classnames('navigation', className, {vertical})}>{this.renderItem(links)}</ul>;
  }
}
