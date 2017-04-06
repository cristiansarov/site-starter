import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Validate } from 'FormComponents';
import {getModelsConfig, setRouterParams} from './MainActions'

if(typeof isDev === 'undefined') { // if if dev, the vendor files are separated, if not, are included in bundle
  require('../Main/Layout/assets/styles/vendor.js');
}
require('../core/utils/components/native.scss');


@connect(state=>({
  validation: state.modal.config && state.modal.config.validation,
  models: state.main.models,
  currentUserId: state.security.currentUser.id
}), {
  getModelsConfig,
  setRouterParams
})
export default class MainComponent extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };
  componentWillMount() {
    const {currentUserId, getModelsConfig} = this.props;
    if(currentUserId) getModelsConfig();
    this.setParams();
    this.context.router.listen(()=>{
      setTimeout(() => {
        this.setParams();
      })
    })
  }
  componentWillUpdate(nextProps) {
    const {currentUserId, getModelsConfig, models} = nextProps;
    if(currentUserId && !models) getModelsConfig();
  }
  setParams() {
    const { location, params, routes, routeParams, setRouterParams } = this.props;
    setRouterParams({
      location: {...location},
      params: {...params},
      routes: [...routes],
      routeParams: {...routeParams},
      router: this.context.router
    });
  }
  render() {
    const {models, children, location} = this.props;
    if(!models && !['login'].includes(location.pathname)) return null;
    return children;
  }
}
