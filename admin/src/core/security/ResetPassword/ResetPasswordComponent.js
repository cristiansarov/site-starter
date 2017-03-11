import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Field } from 'FormComponents'
import { Link } from 'react-router';
import { I18n } from 'react-redux-i18n';
import SecurityLayout from '../securityLayoutComponent';
import { generateResetPasswordToken } from './ResetPasswordActions';


class ResetPasswordComponent extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    document.title = I18n.t('resetPassword.title');
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'resetPassword_reset'});
  }

  onSubmit(formData) {
    this.props.generateResetPasswordToken(formData.email)
      .then(() => this.context.router.replace({name: 'Login'}));
  }

  render() {
    const { handleSubmit, message} = this.props;
    //console.log(message);
    return (
      <SecurityLayout>
          <div className="security-box">
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <h2>{I18n.t('resetPassword.title')}</h2>
              <Field type="email" name="email" placeholder={I18n.t('login.placeholder.email')} />
              { message && message.type == 'error' && <div className="security-message-error">{I18n.t(message.t)}</div> }
              <button type="submit">{I18n.t('button.recoverPassword')}</button>
            </form>
            <div className="login-meta">
              Back to <Link to={{name: 'Login'}}>{I18n.t('button.login')}</Link>
            </div>
          </div>
      </SecurityLayout>
    );
  }
}

function validate(values) {
  const errors = {};

  if(!values.email)
    errors.email = 'Please enter your email';
  else if (!/^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,20})$/.test(values.email))
    errors.email = 'The email entered is not valid';

  return errors;
}

export default connect(state => ({
  message: state.security.resetPassword.message
}), { generateResetPasswordToken })(reduxForm({form: 'ResetPasswordForm', validate})(ResetPasswordComponent));
