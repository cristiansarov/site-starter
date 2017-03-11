import axios from 'axios';

export function getDataResource() {
  return axios({
    method: 'GET',
    url: 'session/getData'
  })
}

export function getResultsResource(params) {
  return axios({
    method: 'GET',
    url: 'session/getResults',
    params
  })
}

export function prevRoundStatusResource() {
  return axios({
    method: 'GET',
    url: 'session/prevRoundStatus'
  });
}

export function nextRoundStatusResource() {
  return axios({
    method: 'GET',
    url: 'session/nextRoundStatus'
  });
}

export function resetRoundStatusResource() {
  return axios({
    method: 'GET',
    url: 'session/resetRoundStatus'
  });
}

export function triggerGetDataResource() {
  return axios({
    method: 'GET',
    url: 'session/triggerGetData'
  });
}

export function generateCurrentRoundResultsResource() {
  return axios({
    method: 'GET',
    url: 'session/generateCurrentRoundResults'
  });
}
