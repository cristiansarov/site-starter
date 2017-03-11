import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Field, SubmitButton } from 'FormComponents';
import { Link } from 'react-router';
import { I18n } from 'react-redux-i18n';
import SecurityLayout from '../securityLayoutComponent';
import { registerUser } from './RegisterActions';


class RegisterComponent extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    document.title = 'Register';
  }

  onSubmit(formData) {
    this.props.registerUser(formData).then(() => {
      this.context.router.replace({name: 'Login'});
    });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <SecurityLayout>

          <div className="security-box">
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <h2>{I18n.t('register.title')}</h2>
              <Field type="text" name="firstName" placeholder={I18n.t('field.firstName')} />
              <Field type="text" name="lastName" placeholder={I18n.t('field.lastName')} />
              <Field type="email" name="email" placeholder={I18n.t('field.email')} />
              <Field type="password" name="password" placeholder={I18n.t('field.password')} />
              <Field type="password" name="repeatedPassword" placeholder={I18n.t('field.repeatPassword')} />
              <SubmitButton>{I18n.t('button.register')}</SubmitButton>
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

  if(!values.firstName) errors.firstName = I18n.t('validation.required');
  if(!values.lastName) errors.lastName = I18n.t('validation.required');
  if(!values.email) errors.email = I18n.t('validation.required');
  else if (!/^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,20})$/.test(values.email)) errors.email = I18n.t('validation.email');
  if(!values.password) errors.password = I18n.t('validation.required');
  else if(!values.repeatedPassword) errors.repeatedPassword = I18n.t('validation.repeatPassword');
  else if(values.password != values.repeatedPassword) errors.repeatedPassword = I18n.t('validation.passwordMatch');

  return errors;
}

export default connect(null, { registerUser })(reduxForm({form: 'RegisterForm', validate})(RegisterComponent));
