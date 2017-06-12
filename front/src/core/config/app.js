import React from 'react';
import {Provider} from 'react-redux';
import getHistory from './getHistory';
import getRoutes from './getRoutes';
import {Router} from 'react-router';
import axios from 'axios';
import store from './store';
import {loadTranslations, setLocale} from 'react-redux-i18n';
import getTranslations from './getTranslations';
import {interceptorSuccess, interceptorError} from './interceptors';


export default class App extends React.Component {

  componentWillMount() {
    const {i18nKeys, appRoutes} = this.props.initialData;
    this.translations = getTranslations(i18nKeys);
    this.routes = getRoutes(appRoutes);
    this.history = getHistory(this.routes);

    // default axios config
    axios.interceptors.response.use(interceptorSuccess, interceptorError);
    axios.defaults.baseURL = '/api';

    // load i18n
    store.dispatch(loadTranslations(this.translations));
    store.dispatch(setLocale('en'));
  }

  render() {
    return (
      <Provider store={store}>
        <div>
          <Router routes={this.routes} history={this.history} onUpdate={logPageView} createElement={this.createElement}/>
        </div>
      </Provider>
    );
  }
  createElement(component, props) { // fix for not re-rendering component routes with same component
    return React.createElement(component, {...props, key: props.location.pathname});
  }
}

function logPageView() {
  if (typeof window === 'undefined' || typeof isDev === 'undefined' || typeof ga === 'undefined') return;
  /* eslint no-undef:0 */
  // ga('create', 'UA-97408816-1', 'auto');
  // ga('send', 'pageview');
}