import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Field, SubmitButton, ResetButton, Validate } from 'FormComponents'
import { getDetails, saveDetails } from './MyAccountActions'
import { PageHeader, Loader, Layout } from 'ContentComponents';
import { toastr } from 'react-redux-toastr';



@connect(state => ({
  currentUserId: state.security.currentUser.id,
  getLoading: state.myAccount.getLoading,
  saveLoading: state.myAccount.saveLoading
}), {
  getDetails,
  saveDetails
})
@reduxForm({
  form: 'MyAccountForm',
  validate: Validate({
    firstName: {required: true},
    lastName: {required: true},
    email: {email: true},
    username: {required: true},
    passwordRepeat: {passwordRepeat: 'passwordNew'}
  })
})
export default class MyAccountDetailsComponent extends Component {
  componentWillMount() {
    document.title = 'Details - My Account - Administration';
    this.props.getDetails(this.props.currentUserId);
  }
  render() {
    const { handleSubmit, reset, getLoading, saveLoading } = this.props;
    return (
      <Layout>
        <form onSubmit={handleSubmit(this.saveDetails.bind(this))}>
          <fieldset disabled={saveLoading}>
            <div className="row">
              <div className="col-md-6">
                <Field name="firstName" label="First Name" />
                <Field name="lastName" label="Last Name" />
                <Field name="email" type="email" label="Email" />
              </div>
              <div className="col-md-6">
                <Field name="username" label="Username" />
                <Field name="passwordNew" type="password" label="Password" />
                <Field name="passwordRepeat" type="password" label="Repeat Password" />
              </div>
            </div>
            <ResetButton reset={reset} />
            <SubmitButton loading={saveLoading} />
          </fieldset>
        </form>
        { getLoading && <Loader /> }
      </Layout>
    );
  }
  saveDetails(formData) {
    const {saveDetails, initialize} = this.props;
    saveDetails(formData).then(response=>{
      toastr.success('The details of your account are saved!');
      initialize(response.value.data);
    });
  }
}
