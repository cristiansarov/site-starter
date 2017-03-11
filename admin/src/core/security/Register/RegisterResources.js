import axios from 'axios';

export function registerUserResource(formData) {
  return axios({
    method: 'POST',
    url: '/user/create',
    data: formData
  });
}
