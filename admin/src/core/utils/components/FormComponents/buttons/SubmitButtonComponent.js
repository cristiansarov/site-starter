import React, {Component} from 'react';
import { I18n } from 'react-redux-i18n';
import {Link} from 'react-router';


export default class SubmitButton extends Component {
  render() {
    var props = {};
    if (this.props.disabled || this.props.loading) props.disabled = true;
    return (
      <button type="submit" className="button button--green" {...props}>
        { this.props.loading && <span className="button-spinner"><i className="fa fa-spinner fa-spin"/></span> }
        { this.props.children || I18n.t('button.save') }
      </button>
    );
  }
}