const initialState = {
  fields: {},
  message: null,
  loggedIn: false,
  redirectRoute: null
};

export default function(state = initialState, action) {
  switch(action.type) {
    case 'login_loading':
      return {...state,
        message: null,
        loggedIn: false,
        loading: true
      };
    case 'login_success':
      return {...state,
        message: {t: 'login.successMessage', type: 'success'},
        loggedIn: true,
        loading: false
      };
    case 'login_error':
      return {...state,
        message: {t: 'login.errorCredentialsMessage', type: 'error'},
        loggedIn: false,
        loading: false
      };
    case 'setRedirectRoute':
      return {...state,
        redirectRoute: action.payload
      };
    case 'login_reset':
      return initialState;
    default:
      return state;
  }
}
