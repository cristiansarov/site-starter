import { getItemResource, updateItemResource } from './../Model/ModelResources';
import store from 'core/config/store';
import { initialize } from 'redux-form';

export function getDetails(userId) {
  return {
    type: 'myAccount/getDetails',
    payload: new Promise((resolve, reject) => {
      getItemResource('user', userId).then(response => {
        store.dispatch(initialize('MyAccountForm', response.data));
        resolve(response);
      }, reject);
    })
  };
}

export function saveDetails(userDetails) {
  return {
    type: 'myAccount/saveDetails',
    payload: updateItemResource('user', userDetails.id, userDetails)
  };
}
