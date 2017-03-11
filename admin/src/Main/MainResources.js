import axios from 'axios';

export function getMainMenuResource() {
  return axios.get('/config/mainMenu')
}

export function getModelsConfigResource() {
  return axios.get('/config/models')
}
