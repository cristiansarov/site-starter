import rootReducer from '../rootReducer';
import { compose, createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { syncTranslationWithStore } from 'react-redux-i18n';


export default function (initialState) {
  const store = compose(
    applyMiddleware(
      promiseMiddleware({
        promiseTypeSuffixes: ['loading', 'success', 'error']
      }),
      thunk
    )
  )(createStore)(rootReducer, initialState || {});
  syncTranslationWithStore(store);
  return store;
}