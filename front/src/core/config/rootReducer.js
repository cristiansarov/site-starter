import { combineReducers } from 'redux';
import { i18nReducer } from 'react-redux-i18n';
import { reducer as formReducer } from 'redux-form';
import appReducers from '../../reducers';
import MainReducer from '../Main/MainReducer';
import ModalReducer from 'core/components/content/Modal/ModalReducer';

export default combineReducers({
  i18n: i18nReducer,
  form: formReducer,
  main: MainReducer,
  modal: ModalReducer,
  ...appReducers
});
