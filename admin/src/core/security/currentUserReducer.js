export default function (state = {}, action) {
  switch (action.type) {
    case 'getCurrentUser_success':
      return action.payload;
    case 'myAccount/saveDetails_success':
      return action.payload;
    case 'user/saveDetails_success':
      if(state.id==action.payload.id) return action.payload;
      else return state;
    case 'logout_success':
      return {};
    default:
      return state;
  }
}
