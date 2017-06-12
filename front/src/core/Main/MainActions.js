import { setDocumentMetaTags } from 'core/utils/helpers'

export function setRouterParams(params) {
  return {
    type: 'main/setRouterParams',
    payload: params
  }
}

export function setMetaTags(metaTags) {
  setDocumentMetaTags(metaTags);
  return {
    type: 'setMetaTags',
    payload: metaTags
  };
}

export function setHeaderContent(payload, noBreadcrumb) {
  return {
    type: 'setHeaderContent',
    payload: payload,
    noBreadcrumb: noBreadcrumb
  };
}

export function openMenu() {
  return {type: 'openMenu'};
}

export function closeMenu() {
  return {type: 'closeMenu'};
}

export function renderMenu() {
  return {type: 'renderMenu'};
}

export function changeModalState(state) {
  return {
    type: 'changeModalState',
    payload: state
  };
}

// Set Server Site Rendering Required Props
export function setSsrRequired(ssrRequired, config) {
  return {
    type: 'setSsrRequired',
    payload: {ssrRequired, ...config}
  };
}