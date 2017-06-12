export function openModal(config) {
  return {
    type: 'modal/open',
    payload: {config}
  }
}

export function closeModal() {
  return dispatch => {
    dispatch({type: 'modal/close'});
    setTimeout(dispatch, 300, {type: 'modal/reset'}); // for not resetting in fadeOut animation
  }
}
