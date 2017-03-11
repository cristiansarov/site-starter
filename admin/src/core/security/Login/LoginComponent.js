import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Field, SubmitButton, Validate } from 'FormComponents';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router';
import { doLogin, getCurrentUser } from './LoginActions';
import { toastr } from 'react-redux-toastr';
import SecurityLayout from '../securityLayoutComponent';

class LoginComponent extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    document.title = I18n.t('login.title');
    if(this.props.currentUserId) this.context.router.replace({name: 'Dashboard'});
  }

  componentDidUpdate() {
    const { currentUserId, redirectRoute, loggedIn, getCurrentUser } = this.props;
    if(currentUserId) {
      toastr.success(I18n.t('login.successMessage'));
      this.context.router.replace(redirectRoute||{name: 'Dashboard'});
    } else if(loggedIn) getCurrentUser();
  }

  render() {
    const { handleSubmit, message, loading } = this.props;
    return (
      <SecurityLayout>

        <div className="security-box sb-login">
          <img src={require('../assets/login-user.svg')} />
          <form onSubmit={handleSubmit(this.props.doLogin.bind(this))}>
            <Field name="username" placeholder={I18n.t('login.placeholder.email')} autoCapitalize="off" autoCorrect="off" />
            <Field type="password" name="password" placeholder={I18n.t('login.placeholder.password')} />
            { message && message.type=='error' && <div className="security-message-error">{I18n.t(message.t)}</div> }
            <SubmitButton loading={loading}>{I18n.t('button.login')}</SubmitButton>
          </form>
          <div className="login-meta">
            <Link to={{name: 'ResetPassword'}}>{I18n.t('button.recoverPassword')}</Link>
            <div>You are new here?</div>
            <Link to={{name: 'Register'}}>{I18n.t('button.signUp')}</Link>
          </div>
        </div>

      </SecurityLayout>
    );
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'login_reset'});
  }

}

const validate = Validate({username: {required: true}, password: {required: true}});

LoginComponent = reduxForm({form: 'LoginForm', validate})(LoginComponent);

export default connect( state => ({
  initialValues: state.security.login.fields,
  currentUserId: state.security.currentUser.id,
  message: state.security.login.message,
  loading: state.security.login.loading,
  loggedIn: state.security.login.loggedIn,
  redirectRoute: state.security.login.redirectRoute
}), {
  doLogin,
  getCurrentUser
})(LoginComponent);
