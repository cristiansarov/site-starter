const initialState = {
  roundList: null,
  currentRound: null,
  loading: false,
  results: null
};

export default function (state = initialState, action) {
  switch (action.type) {


    // GET DATA
    case 'dashboard/getData_loading':
      return {
        ...state,
        loading: true
      };
    case 'dashboard/getData_success':
      return {
        ...state,
        loading: false,
        ...action.payload.data
      };
    case 'dashboard/getData_error':
      return {
        ...state,
        loading: false,
        roundList: null,
        currentRound: null
      };


    // GET RESULTS
    case 'dashboard/getResults_loading':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'dashboard/getResults_success':
      return {
        ...state,
        loading: false,
        results: action.payload.data,
        error: null
      };
    case 'dashboard/getResults_error':
      return {
        ...state,
        loading: false,
        results: null,
        error: action.payload.message || null
      };


    // CLEAR RESULTS
    case 'dashboard/clearResults':
      return {
        ...state,
        results: null,
        error: null
      };


    // SUBSCRIBE TO WEBSOCKETS
    case 'dashboard/subscribe':
      return {
        ...state,
        io: action.payload
      };


    // STATE RESET
    case 'dashboard/stateReset':
      return initialState;


    // DEFAULT
    default:
      return state;

  }
}
