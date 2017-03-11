const initialState = {
  details: null,
  getLoading: false,
  saveLoading: false
};

export default function(state = initialState, action) {
  switch(action.type) {

    // GET
    case 'myAccount/getDetails_loading':
      return Object.assign({}, state, {
        getLoading: true
      });
    case 'myAccount/getDetails_success':
      return Object.assign({}, state, {
        details: action.payload.data,
        getLoading: false
      });

    // UPDATE
    case 'myAccount/saveDetails_loading':
      return Object.assign({}, state, {
        saveLoading: true
      });
    case 'myAccount/saveDetails_success':
      return Object.assign({}, state, {
        saveLoading: false
      });


    default:
      return state;
  }
}
