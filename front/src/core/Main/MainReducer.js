const defaultState = {
  menuOpened: false,
  metaTags: {},
  noBreadcrumb: false,
  modalOpened: false,
  modalLoading: false,
  global: {},
  ssrRequired: []
};

export default function (state = defaultState, action) {
  switch (action.type) {


    case 'main/setRouterParams': {
      return {
        ...state,
        ...action.payload
      }
    }


    // MENU
    case 'openMenu':
      return {
        ...state,
        menuOpened: true
      };
    case 'closeMenu':
      return {
        ...state,
        menuOpened: false
      };
    case 'renderMenu':
      return {
        ...state,
        menuRendered: true
      };


    case 'setHeaderContent':
      return {
        ...state,
        headerContent: action.payload,
        noBreadcrumb: action.noBreadcrumb || false
      };
    case 'setMetaTags':
      return {
        ...state,
        metaTags: {
          ...state.metaTags,
          ...action.payload
        }
      };
    case 'changeModalState':
      return {
        ...state,
        ...action.payload
      };

    case 'setSsrRequired':
      return {
        ...state,
        ...action.payload,
        ssrRequired: [
          ...state.ssrRequired,
          ...action.payload.ssrRequired
        ]
      };

    default:
      return state;
  }
}