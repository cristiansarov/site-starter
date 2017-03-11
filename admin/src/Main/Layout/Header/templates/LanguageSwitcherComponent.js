import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import App from 'core/config/app';


class LanguageSwitcherComponent extends Component {

  changeLocale(locale) {
    this.props.setLocale(locale);
    // Rerender whole App
    ReactDOM.unmountComponentAtNode(document.querySelector('#app'));
    ReactDOM.render(<App />, document.querySelector('#app'));
  }

  render() {
    return (
      <DropdownButton title={this.props.locale} className="language-switcher" id="language-switcher" pullRight onSelect={this.changeLocale.bind(this)}>
        <MenuItem eventKey="ro">Ro</MenuItem>
        <MenuItem eventKey="en">En</MenuItem>
      </DropdownButton>
    )
  }

}

export default connect(state=>({
  locale: state.i18n.locale
}), {
  setLocale
})(LanguageSwitcherComponent);
