import store from '../../../../config/store';
import { initialize } from 'redux-form';

export function changeModalState(data) {
  return {
    type: 'modalStateChange',
    payload: data
  }
}

export function openModal(config, params) {
  return {
    type: 'modalOpen',
    payload: {config, params}
  }
}

export function closeModal() {
  store.dispatch(initialize('ModalForm', null)); // reset modal form
  return {
    type: 'modalClose'
  }
}
