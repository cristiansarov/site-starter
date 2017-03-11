import rootReducer from 'core/config/rootReducer';
import promiseMiddleware from 'redux-promise-middleware';
import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { syncTranslationWithStore } from 'react-redux-i18n';


const store = compose(
  applyMiddleware(
    promiseMiddleware({
      promiseTypeSuffixes: ['loading', 'success', 'error']
    }),
    thunk
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(rootReducer);

syncTranslationWithStore(store);

export default store;
