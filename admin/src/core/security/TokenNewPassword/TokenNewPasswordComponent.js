import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Field } from 'FormComponents';
import { I18n } from 'react-redux-i18n';
import SecurityLayout from '../securityLayoutComponent';
import { newPasswordWithToken } from './TokenNewPasswordActions';

class TokenNewPasswordComponent extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    document.title = I18n.t('tokenNewPassword.title');
  }

  onSubmit(formData) {
    const token = this.props.location.query.token;

    if (token) {
      this.props.newPasswordWithToken(formData, token).then(() => {
        this.context.router.replace({name: 'Login'});
      });
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <SecurityLayout>
        <div className="security-box">
          <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <h2>{I18n.t('button.resetPassword')}</h2>
            <Field type="password" name="password" placeholder={I18n.t('login.placeholder.password')} />
            <Field type="password" name="passwordConfirmation" placeholder={I18n.t('tokenNewPassword.placeholder.passwordConfirmation')} />
            <button type="submit">{I18n.t('button.resetPassword')}</button>
          </form>
        </div>
      </SecurityLayout>
    );
  }
}

function validate(values) {
  const errors = {};

  if(!values.password)
    errors.password = 'Please enter your password';
  else if (!values.passwordConfirmation)
    errors.passwordConfirmation = 'Please confirm the password';
  else if (values.password !== values.passwordConfirmation)
    errors.passwordConfirmation = 'The two passwords must match';

  return errors;
}

export default connect(null, { newPasswordWithToken })(reduxForm({form: 'TokenNewPasswordForm', validate})(TokenNewPasswordComponent));
