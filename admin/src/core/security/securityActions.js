import { checkAuthentication, getCurrentUserResource } from './securityResources';
import store from 'core/config/store';
const { dispatch } = store;
import history from 'core/config/history';
import { I18n } from 'react-redux-i18n';
import { toastr } from 'react-redux-toastr';
const authPaths = ['login', 'register', 'reset-password', 'token-new-password'];
const isOnAuthPaths = path => authPaths.indexOf(path) > -1;
const redirect = where => history.replace({name: where == 'login' ? 'Login' : 'Dashboard'});


/**
 * Set redirect route on logout
 * @description If the user is not authenticated, it sets the initial route to redux state
 */
export function setRedirectRoute(route) {
  return {
    type: 'setRedirectRoute',
    payload: route
  }
}


/**
 * On Location Transition Async Auth Check
 * @description Every time the location is changing, check if authenticated
 */
export function asyncTransitionCheck(route) {
  document.title = ''; // reset document title
  var path = route.pathname;
  if(path=='logout' || !store.getState().security.currentUser.id) return;
  checkAuthentication()
    .then(() => { // if is authenticated and on auth routes redirect to app
      if (isOnAuthPaths(path)) redirect('app');
    }).catch(() => { // if is not authenticated and not on auth routes redirect to login
      dispatch({type: 'logout_success'}); // clearing current user object
      if (!isOnAuthPaths(path)) {
        toastr.success(I18n.t('login.logoutByTimeoutMessage'));
        dispatch(setRedirectRoute(route));
        redirect('login');
      }
    });
}


/**
 * On App Boot Sync Auth Check
 * @description The application will not boot until the currentUser is resolved
 */
export function syncAuthCheck(nextState, replace, cb) {
  var path = nextState.location.pathname;
  checkAuthentication().then(() => { // if is authenticated, get User, and continue or redirect to app if on auth routes
    getCurrentUserResource().then(response => {
      dispatch({type: 'getCurrentUser_success', payload: response.data});
      if (!isOnAuthPaths(path)) cb();
      else redirect('app');
    });
  }).catch(() => { // if is not authenticated and not on auth routes redirect to login
    if (isOnAuthPaths(path)) cb();
    else {
      dispatch(setRedirectRoute(nextState.location));
      redirect('login');
    }
  });
}
