import { newPasswordWithTokenResource } from './TokenNewPasswordResources';

export function newPasswordWithToken(formData, token) {
  return {type: 'newPasswordWithToken', payload: new Promise((resolve, reject) => {
    newPasswordWithTokenResource(formData, token).then(response => {
      resolve(response.data);
    }, reject);
  })};
}
