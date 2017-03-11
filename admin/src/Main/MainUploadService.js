import axios from 'axios';

export function uploadImage(file) {
  const data = new FormData();
  data.append('image', file);
  return axios.post('/image/upload', data)
}
