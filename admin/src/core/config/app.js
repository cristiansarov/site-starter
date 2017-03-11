import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { interceptorSuccess, interceptorError } from './config';
import history from './history'
import routes from './routes';
import { Router } from 'react-router';
import axios from 'axios';
import { asyncTransitionCheck } from 'core/security/securityActions';
import { loadTranslations, setLocale } from 'react-redux-i18n';
import store from './store'
import ReduxToastr from 'react-redux-toastr';
import translations from './translations';


// add interceptor to all http responses
axios.interceptors.response.use(interceptorSuccess, interceptorError);
axios.defaults.baseURL = '/api';

// async check on every route if the current user is authenticated
history.listen(route => asyncTransitionCheck(route, history));


// load i18n
store.dispatch(loadTranslations(translations));
store.dispatch(setLocale('en'));

export default class AppComponent extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Router history={history} routes={routes} />
          <ReduxToastr timeOut={3000} />
        </div>
      </Provider>
    );
  }
}
