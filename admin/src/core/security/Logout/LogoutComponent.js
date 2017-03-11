import React, { Component } from 'react';
import { connect } from 'react-redux';
import { doLogout } from './LogoutActions';
import { toastr } from 'react-redux-toastr';
import { I18n } from 'react-redux-i18n';


class LogoutComponent extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.doLogout();
  }

  componentDidUpdate() {
    if(!this.props.currentUserId) {
      toastr.success(I18n.t('login.logoutSuccessMessage'));
      this.context.router.replace({name: 'Login'});
    }
  }

  render() {
    return null;
  }

}

export default connect(state => ({
  currentUserId: state.security.currentUser.id
}), {
  doLogout
})(LogoutComponent);
