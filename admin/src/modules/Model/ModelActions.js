import { getPagedListResource, getListResource, getItemResource, createItemResource, updateItemResource, deleteItemResource, deleteItemsResource } from './ModelResources';


export function getPagedList(modelName, query) {
  return {
    type: 'model/getPagedList',
    payload: getPagedListResource(modelName, query),
    meta: { modelName }
  }
}

export function getList(modelName) {
  return {
    type: 'model/getList',
    payload: getListResource(modelName),
    meta: { modelName }
  }
}

export function appendItemToList(modelName, item) {
  return {
    type: 'model/appendItemToList',
    payload: {modelName, item}
  }
}

export function replaceItemInList(modelName, id, item) {
  return {
    type: 'model/replaceItemInList',
    payload: {modelName, id, item}
  }
}

export function removeItemFromList(modelName, id) {
  return {
    type: 'model/removeItemFromList',
    payload: {modelName, id}
  }
}

export function getItem(modelName, modelId) {
  return {
    type: 'model/getItem',
    payload: getItemResource(modelName, modelId)
  }
}

export function createItem(modelName, data) {
  return {
    type: 'model/saveItem',
    payload: createItemResource(modelName, data)
  }
}

export function updateItem(modelName, modelId, data) {
  return {
    type: 'model/saveItem',
    payload: updateItemResource(modelName, modelId, data)
  }
}

export function deleteItem(modelName, modelId) {
  return {
    type: 'model/deleteItem',
    payload: deleteItemResource(modelName, modelId)
  }
}

export function deleteItems(modelName, modelIds) {
  return {
    type: 'model/deleteItems',
    payload: deleteItemsResource(modelName, modelIds)
  }
}

export function resetPagedList() {
  return {
    type: 'model/resetPagedList'
  }
}
