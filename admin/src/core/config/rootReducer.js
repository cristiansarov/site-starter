import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import { reducer as toastrReducer } from 'react-redux-toastr'
import { reducer as formReducer } from 'redux-form';
import { i18nReducer } from 'react-redux-i18n';
import ModalReducer from '../utils/components/ContentComponents/Modal/ModalReducer';
import securityReducer from 'core/security/securityReducer';
import MainReducer from '../../Main/MainReducer';
import DashboardReducer from 'modules/Dashboard/DashboardReducer';
import appReducers from '../../reducers';

const rootReducer = combineReducers({
  router: routerStateReducer,
  toastr: toastrReducer,
  form: formReducer,
  i18n: i18nReducer,
  modal: ModalReducer,
  security: securityReducer,
  main: MainReducer,
  dashboard: DashboardReducer,
  ...appReducers
});

export default rootReducer;
