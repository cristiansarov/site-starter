import { registerUserResource } from './RegisterResources';

export function registerUser(formData) {
  return {type: 'registerUser', payload: new Promise((resolve, reject) => {
    registerUserResource(formData).then(response => {
      resolve(response.data);
    }, reject);
  })};
}
