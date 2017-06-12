const initialState = {
  opened: false,
  config: null
};

export default function (state = initialState, action) {
  switch (action.type) {

    case 'modal/open': {
      return {
        ...state,
        opened: true,
        config: action.payload.config
      };
    }

    case 'modal/close': {
      return {
        ...state,
        opened: false
      };
    }

    case 'modal/reset': {
      return initialState;
    }

    default: {
      return state;
    }
  }
}
