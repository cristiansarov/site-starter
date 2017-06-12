import React, {Component} from 'react';
import { I18n } from 'react-redux-i18n';
import {Link} from 'react-router';


export default class ReturnButton extends Component {
  render() {
    return (
      <Link className="button" to={this.props.route}>
        { this.props.children || I18n.t('button.return') }
      </Link>
    );
  }
}