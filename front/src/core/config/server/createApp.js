import React from 'react';
import { Provider } from 'react-redux';
import axios from 'axios';
import { loadTranslations, setLocale } from 'react-redux-i18n';
import getTranslations from '../getTranslations';
const { RouterContext } = require('react-router');
import {interceptorSuccess, interceptorError} from '../interceptors';



export default function (store, renderProps, i18nKeys) {

  const translations = getTranslations(i18nKeys);

  // default axios baseURL
  axios.defaults.baseURL = `${sails.config.publicUrl}/api`;
  axios.interceptors.response.use(interceptorSuccess, interceptorError);

  // load i18n
  store.dispatch(loadTranslations(translations));
  store.dispatch(setLocale('en'));

  return function () {
    return (
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    );
  };
}
