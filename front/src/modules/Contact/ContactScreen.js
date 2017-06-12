import React, { Component } from 'react';
import {connect, reduxForm} from 'core/decorators';
import axios from 'axios';
import {Validate, Field, SubmitButton} from 'core/components/form';
import {PageHeader, Map} from 'core/components/content';
import './Contact.scss';


@connect()
@reduxForm({form: 'ContactForm', validate: Validate({
  name: {required: true},
  email: {required: true, email: true},
  message: {required: true}
})})
export default class ContactScreen extends Component {

  componentWillMount() {
    this.state = {loading: false};
  }

  render() {
    const { handleSubmit } = this.props;
    const { sending, successMessage } = this.state;
    return (
      <div>

        <PageHeader title="Contact" />

        <div className="content contact-form">
          <div className="container-600">

            <form onSubmit={handleSubmit(this.onSubmit.bind(this))} noValidate>
              <div className="row row-sm">
                <div className="col-xs-6">
                  <Field name="name" placeholder="Name*" />
                  <Field name="email" placeholder="Email*" />
                  <Field name="phone" placeholder="Phone number" />
                </div>
                <div className="col-xs-6">
                  <Field name="company" placeholder="Company name" />
                  <Field name="message" type="textarea" placeholder="Message*" />
                </div>
              </div>
              <div className="text-center">
                <SubmitButton className="button button-normal" loading={sending}>SEND</SubmitButton>
              </div>
              <div className="message">
                {successMessage && 'The message has been sent !'}
              </div>
            </form>

          </div>
        </div>

        <Map className="contact-map" lat={44.4340583} lng={26.0677452} zoom={15} height={400} scrollWheel={false} />

      </div>
    );
  }

  onSubmit(formData) {
    this.setState({sending: true});
    axios.post('/sendContactForm', formData).then(()=>{
      this.setState({sending: false, successMessage: true});
      setTimeout(() => {
        this.setState({successMessage: false});
      }, 3000);
      this.props.reset();
    });
  }

}