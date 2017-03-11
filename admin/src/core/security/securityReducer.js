import { combineReducers } from 'redux';
import LoginReducer from './Login/LoginReducer';
import RegisterReducer from './Register/RegisterReducer';
import ResetPasswordReducer from './ResetPassword/ResetPasswordReducer';
import currentUserReducer from './currentUserReducer';
import TokenNewPasswordReducer from './TokenNewPassword/TokenNewPasswordReducer';

export default combineReducers({
  currentUser: currentUserReducer,
  login: LoginReducer,
  register: RegisterReducer,
  resetPassword: ResetPasswordReducer,
  tokenNewPassword: TokenNewPasswordReducer
});
