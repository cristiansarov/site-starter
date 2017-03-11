const initialState = {
  loading: false,
  message: null
};

export default function(state = initialState, action) {
  switch(action.type) {
    case 'generateResetPasswordToken_loading':
      return {...state, loading: true, message: null};
    case 'generateResetPasswordToken_success':
      return {...state, loading: false, message: null};
    case 'generateResetPasswordToken_error':
      return {...state, loading: false, message: {type: 'error', t: 'resetPassword.message.emailNotExist'}};
    case 'resetPassword_reset':
      return initialState;
    default:
      return state;
  }
}
