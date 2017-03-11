import { login, getCurrentUserResource } from '../securityResources';

export function doLogin(formData) {
  return {type: 'login', payload: new Promise((resolve, reject) => {
    login(formData).then(resolve, reject);
  })};
}

export function getCurrentUser() {
  return {type: 'getCurrentUser', payload: new Promise(resolve => {
    getCurrentUserResource().then(response => resolve(response.data));
  })};
}
