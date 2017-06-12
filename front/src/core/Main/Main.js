import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'core/decorators';
import {setRouterParams, setMetaTags} from '../Main/MainActions';
import Layout from '../../Layout/Layout';
import {I18n} from 'core/components/content'


@connect(state=>({
  menuOpened: state.main.menuOpened,
  metaTags: state.main.metaTags,
  noBreadcrumb: state.main.noBreadcrumb
}), {
  setRouterParams,
  setMetaTags
})
export default class Main extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    const {location, params, routes, routeParams, setRouterParams, setMetaTags} = this.props;
    setRouterParams({
      location: {...location, query: location.query || {}},
      params: {...params},
      routes: [...routes],
      routeParams: {...routeParams},
      router: this.context.router
    });
    const routeName = routes[routes.length - 1].name;
    setMetaTags({
      title: I18n.t(`${routeName}.metaTitle`),
      description: I18n.t(`${routeName}.metaDescription`),
    });
    this.unlistenToRouter = this.context.router.listen(location => {
      setRouterParams({location: {...location, query: location.query || {}}});
    });
  }

  render() {
    const {children} = this.props;
    return (
      <Layout>{children}</Layout>
    );
  }

  componentWillUnmount() {
    console.log('unmounting');
    this.unlistenToRouter();
  }

}