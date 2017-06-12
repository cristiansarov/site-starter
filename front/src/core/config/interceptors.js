export function interceptorSuccess(response) {
  if(response.data.status && response.data.status>=400 && response.data.status<500) {
    return Promise.reject(response.data);
  }
  return response;
}

export function interceptorError(error) {
  return Promise.reject(error);
}
