import { generateResetPasswordTokenResource } from './ResetPasswordResources'

export function generateResetPasswordToken(email) {
  return {type: 'generateResetPasswordToken', payload: new Promise((resolve, reject) => {
    generateResetPasswordTokenResource(email).then(response => {
      resolve(response.data);
    }, reject);
  })};
}
