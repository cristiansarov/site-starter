import axios from 'axios';

export function login(formData) {
  return axios({
    method: 'POST',
    url: '/security/login',
    data: formData
  });
}

export function logout() {
  return axios({
    method: 'GET',
    url: '/security/logout'
  });
}

export function checkAuthentication() {
  return axios({
    method: 'GET',
    url: '/security/checkAuthentication'
  });
}

export function getCurrentUserResource() {
    return axios({
      method: 'GET',
      url: '/security/currentUser'
    });
}
