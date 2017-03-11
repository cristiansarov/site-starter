import axios from 'axios';

export function generateResetPasswordTokenResource(email) {
  return axios({
    method: 'POST',
    url: '/user/generateResetPasswordToken',
    data: {email}
  });
}
