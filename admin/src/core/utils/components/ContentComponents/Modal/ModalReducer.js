const initialState = {
  isOpened: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'modalOpen':
      return {
        ...state,
        isOpened: true,
        config: action.payload.config,
        params: action.payload.params
      };
    case 'modalClose':
      return initialState;
    case 'modalStateChange':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
