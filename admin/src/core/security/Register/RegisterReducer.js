const initialState = {
  loading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case 'registerUser_loading':
      return {...state, loading: true};
    case 'registerUser_success':
      return {...state, loading: false};
    case 'registerUser_error':
      return {...state, loading: false};
    default:
      return state;
  }
}
