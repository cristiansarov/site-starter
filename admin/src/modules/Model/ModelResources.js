import axios from 'axios';

export function getPagedListResource(modelName, {page=1, perPage=5, populate, ...where}) {
  return axios({
    method: 'GET',
    url: `${modelName}/list/paged`,
    params: { page, perPage, populate: JSON.stringify(populate), where: JSON.stringify(where) }
  })
}

export function getListResource(modelName) {
  return axios({
    method: 'GET',
    url: `${modelName}/list`
  })
}

export function getItemResource(modelName, modelId) {
  return axios({
    method: 'GET',
    url: `${modelName}/get/${modelId}`
  })
}

export function createItemResource(modelName, data) {
  return axios({
    method: 'POST',
    url: `${modelName}/create`,
    data
  })
}

export function updateItemResource(modelName, modelId, data) {
  return axios({
    method: 'PUT',
    url: `${modelName}/update/${modelId}`,
    data
  })
}

export function deleteItemResource(modelName, modelId) {
  return axios({
    method: 'DELETE',
    url: `${modelName}/delete/${modelId}`
  })
}

export function deleteItemsResource(modelName, modelIds) {
  return axios({
    method: 'DELETE',
    url: `${modelName}/delete/multiple`,
    data: { ids: modelIds }
  })
}
