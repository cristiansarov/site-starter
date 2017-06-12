import React, {Component} from 'react';
import {connect, reduxForm} from 'core/decorators';
import {Field, Validate, SubmitButton} from 'core/components/form';
import {I18n} from 'core/components/content';
import axios from 'axios';


@connect() // reduxForm doesn't work without connect
@reduxForm({form: 'FooterNewsletterForm', validate: Validate({
  EMAIL: {required: true, email: true}
})})
export default class FooterNewsletter extends Component {
  state = {};
  render() {
    const {handleSubmit} = this.props;
    const {loading, message, messageType} = this.state;
    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))} noValidate>
        <h4 className="margin-top-0">{I18n.t('footer.newsletter.description')}</h4>
        <div className="footer-newsletter">
          <Field type="email" name="EMAIL" placeholder="Subscribe to our newsletter" />
          <SubmitButton>
            {loading ? (
              <i className="icon-spinner icon-spin" />
            ) : (
              <i className="icon-arrow-right" />
            )}
          </SubmitButton>
          {message && (
            <div className={`message message-${messageType}`}>{message}</div>
          )}
        </div>
      </form>
    );
  }
  onSubmit(formData) {
    const {reset} = this.props;
    this.setState({loading: true});
    axios.post('/mailchimp/subscribe/newsletter', {fields: formData}).then(() => {
      reset();
      this.setState({loading: false, message: 'Congratulations! You are subscribed!', messageType: 'success'});
      setTimeout(()=>{
        this.setState({message: '', messageType: ''});
      }, 5000)
    }).catch(response => {
      this.setState({loading: false});
      if (response.data.title === 'Member Exists') {
        this.setState({message: 'The member already exist', messageType: 'error'});
      } else {
        this.setState({message: response.data.detail, messageType: 'error'});
      }
    });
  }
}