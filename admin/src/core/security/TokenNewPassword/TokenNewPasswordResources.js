import axios from 'axios';

export function newPasswordWithTokenResource(formData, token) {
  return axios({
    method: 'POST',
    url: '/user/tokenNewPassword',
    data: {
      password: formData.password,
      token: token
    }
  });
}
