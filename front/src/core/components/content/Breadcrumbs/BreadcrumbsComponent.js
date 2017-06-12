import React from 'react';
import Breadcrumbs from 'react-router-breadcrumbs';
import {connect} from 'core/decorators';
import {I18n} from 'react-redux-i18n';
import {Link} from 'react-router';
import classnames from 'classnames';
import './Breadcrumbs.scss';


@connect(state=>({
  routes: state.main.routes,
  params: state.main.params,
  state: state // this forces the component to re-render for custom title to be shown (eg: ForumItem => My Grea
}))
export default class BreadcrumbsComponent extends React.Component {
  render() {
    const { routes, params, className } = this.props;
    return (
      <Breadcrumbs className={classnames('breadcrumbs', className)}
                   routes={routes}
                   params={params}
                   resolver={this.resolver.bind(this)}
                   createSeparator={this.separator}
                   createLink={this.createLink}
      />
    )
  }
  resolver(key, text, routePath, route) {
    const {state} = this.props;
    if(route.breadcrumbResolve) return route.breadcrumbResolve(state) || <i className="icon-spin icon-spinner" />;
    return I18n.t(`route.${text}`);
  }
  separator(e, i) {
    return <span key={i}> > </span>;
  }
  createLink(link, key, text, index, routes) {
    const routeNumber = routes.filter(i=>!i.breadcrumbIgnore).length;
    if(index==routeNumber) return <strong key={key}>{text}</strong>;
    return <Link to={link} key={key}>{text}</Link>;
  }
}