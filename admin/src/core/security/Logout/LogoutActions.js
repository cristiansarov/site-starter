import { logout } from '../securityResources';

export function doLogout() {
  return {type: 'logout', payload: new Promise(resolve => {
    logout().then(() => resolve());
  })};
}
