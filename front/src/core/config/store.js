import rootReducer from './rootReducer';
import { compose, createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { syncTranslationWithStore } from 'react-redux-i18n';

const initialState = typeof window !== 'undefined' && window.__initial_state__;

const store = compose(
  applyMiddleware(
    promiseMiddleware({
      promiseTypeSuffixes: ['loading', 'success', 'error']
    }),
    thunk
  ),
  typeof window !== 'undefined' && typeof isDev !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(rootReducer, initialState || {});

syncTranslationWithStore(store);

export default store;