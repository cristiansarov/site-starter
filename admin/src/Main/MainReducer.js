const initialState = {
  mainMenu: null
};

export default function (state = initialState, action) {
  switch (action.type) {


    // GET MAIN MENU
    case 'main/getMainMenu_loading':
      return {
        ...state,
        mainMenuLoading: true
      };
    case 'main/getMainMenu_success':
      return {
        ...state,
        mainMenuLoading: false,
        mainMenu: action.payload.data
      };
    case 'main/getMainMenu_error':
      return {
        ...state,
        mainMenuLoading: false
      };



    case 'main/getModelsConfig_success':
      return {
        ...state,
        models: action.payload.data
      };



    case 'main/setRouterParams': {
      return {
        ...state,
        ...action.payload
      }
    }


    // DEFAULT
    default:
      return state;

  }
}
