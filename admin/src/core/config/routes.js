import Main from 'Main/MainComponent';
import { syncAuthCheck } from 'core/security/securityActions';
import Dashboard from 'modules/Dashboard/DashboardComponent';
import Login from 'core/security/Login/LoginComponent';
import Logout from 'core/security/Logout/LogoutComponent';
import Register from 'core/security/Register/RegisterComponent';
import ResetPassword from 'core/security/ResetPassword/ResetPasswordComponent';
import TokenNewPassword from 'core/security/TokenNewPassword/TokenNewPasswordComponent';
import appRoutes from '../../routes';
import NotFound from 'Main/Layout/NotFound/NotFoundComponent';


export default {
  path: '/',
  breadcrumbName: 'Home',
  component: Main,
  onEnter: syncAuthCheck,
  indexRoute: {name: 'Dashboard', component: Dashboard},
  childRoutes: [
    {path: 'login', name: 'Login', component: Login},
    {path: 'logout', name: 'Logout', component: Logout},
    {path: 'register', name: 'Register', component: Register},
    {path: 'reset-password', name: 'ResetPassword', component: ResetPassword},
    {path: 'token-new-password', name: 'TokenNewPassword', component: TokenNewPassword},
    ...appRoutes,
    {path: '*', component: NotFound}
  ]
};
