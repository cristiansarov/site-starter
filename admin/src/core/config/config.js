/* eslint no-console:0 */
import history from 'core/config/history';
import store from 'core/config/store';
import { toastr } from 'react-redux-toastr';

export function interceptorSuccess(response) {
  if(response.data && response.data.status && response.data.status>=400 && response.data.status<500) {
    if(response.data.code=='policy.notAutenticated' && !['/login', '/admin/login'].includes(window.location.pathname)) {
      store.dispatch({type: 'logout_success'}); // clearing current user object
      history.push({name: 'Login'});
    } else return Promise.reject(response.data);
  }
  return response;
}

export function interceptorError(error) {
  toastr.error(`${error.response.statusText} (${error.response.status})`, error.response.data);
  return Promise.reject(error);
}
