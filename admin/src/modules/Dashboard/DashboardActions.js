import { getDataResource, getResultsResource, prevRoundStatusResource, nextRoundStatusResource, resetRoundStatusResource, triggerGetDataResource, generateCurrentRoundResultsResource } from './DashboardResources';
import store from 'core/config/store';


export function getData() {
  return {
    type: 'dashboard/getData',
    payload: new Promise((resolve, reject) => {
      getDataResource().then(response => {

        // if websockets not enabled, dispatch subscription
        if(!store.getState().dashboard.io) store.dispatch(subscribe());

        resolve(response);
      }, reject)
    })
  }
}

export function getResults(params) {
  return {
    type: 'dashboard/getResults',
    payload: getResultsResource(params)
  }
}

export function clearResults() {
  return {
    type: 'dashboard/clearResults'
  }
}

export function prevRoundStatus() {
  prevRoundStatusResource();
}

export function nextRoundStatus() {
  nextRoundStatusResource();
}

export function resetRoundStatus() {
  resetRoundStatusResource();
}

export function triggerGetData() {
  triggerGetDataResource();
}

export function subscribe() {
  return dispatch => {

    function currentRoundChangeHandler(newStatus) {
      if(newStatus=='stopped') generateCurrentRoundResultsResource();
      dispatch(getData());
    }

    var io = require('sails.io.js')( require('socket.io-client') );

    io.socket.on('connect', function() {
      io.socket.get('/api/session/subscribeToCurrentRound'); // subscribe to websocket room
      dispatch(getData());
      io.socket.on('currentRoundChanged', currentRoundChangeHandler);
    });

    io.socket.on('disconnect', function() {
      io.socket.off('currentRoundChanged', currentRoundChangeHandler);
    });

    dispatch({type: 'dashboard/subscribe', payload: io});

  }
}

export function unsubscribe() {
  var io = store.getState().dashboard.io;
  if(io) {
    io.socket.disconnect();
    delete io.sails;
  }
}

export function stateReset() {
  unsubscribe();
  return { type: 'dashboard/stateReset' };
}
