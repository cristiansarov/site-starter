const initialState = {
  loading: false,
  status: 'success'
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'newPasswordWithToken_loading':
      return {...state, loading: true};
    case 'newPasswordWithToken_success':
      return {...state, loading: false};
    case 'newPasswordWithToken_error':
      return {...state, loading: false};
    default:
      return state;
  }
}
