import { getMainMenuResource, getModelsConfigResource } from './MainResources';

export function getMainMenu() {
  return {
    type: 'main/getMainMenu',
    payload: getMainMenuResource()
  }
}
export function getModelsConfig() {
  return {
    type: 'main/getModelsConfig',
    payload: getModelsConfigResource()
  }
}

export function setRouterParams(params) {
  return {
    type: 'main/setRouterParams',
    payload: params
  }
}
