import React, {Component} from 'react';
import { I18n } from 'react-redux-i18n';
import {Link} from 'react-router';


export default class ResetButton extends Component {
  render() {
    return (
      <button type="button" className="button" onClick={this.props.reset}>
        { this.props.children || I18n.t('button.reset') }
      </button>
    );
  }
}