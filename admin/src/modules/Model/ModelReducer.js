import {getModelPrimaryKey} from 'helpers';

const initialState = {
  pagedList: {},
  totalPages: {},
  list: {},
  listLoading: false,
  item: null,
  itemLoading: false,
  saveLoading: false,
  deleteLoading: false
};

export default function (state = initialState, action) {
  let modelName;
  let modelPK;
  switch (action.type) {


    // GET PAGED LIST
    case 'model/getPagedList_loading': {
      return {
        ...state,
        listLoading: true
      }
    }
    case 'model/getPagedList_success': {
      return {
        ...state,
        listLoading: false,
        pagedList: {
          ...state.pagedList,
          [action.meta.modelName]: action.payload.data.data
        },
        totalPages: {
          ...state.totalPages,
          [action.meta.modelName]: action.payload.data.meta.paginate.totalPages
        }
      }
    }
    case 'model/getPagedList_error': {
      return {
        ...state,
        listLoading: false
      }
    }



    // GET LIST
    case 'model/getList_loading': {
      return {
        ...state,
        listLoading: true
      }
    }
    case 'model/getList_success': {
      return {
        ...state,
        listLoading: false,
        list: {
          ...state.list,
          [action.meta.modelName]: action.payload.data
        }
      }
    }
    case 'model/getList_error': {
      return {
        ...state,
        listLoading: false
      }
    }



    // APPEND ITEM TO LIST
    case 'model/appendItemToList': {
      return {
        ...state,
        pagedList: {
          ...state.pagedList,
          [action.payload.modelName]: [
            ...state.pagedList[action.payload.modelName],
            action.payload.item
          ]
        }
      }
    }


    // REPLACE ITEM IN LIST
    case 'model/replaceItemInList': {
      modelName = action.payload.modelName;
      modelPK = getModelPrimaryKey(modelName);
      return {
        ...state,
        pagedList: {
          ...state.pagedList,
          [modelName]: state.pagedList[modelName].map(item=>{
            if(item[modelPK]==action.payload[modelPK]) return action.payload.item;
            else return {...item};
          })
        }
      }
    }


    // REMOVE ITEM FROM
    case 'model/removeItemFromList': {
      modelName = action.payload.modelName;
      modelPK = getModelPrimaryKey(modelName);
      return {
        ...state,
        pagedListw: {
          ...state.pagedList,
          [action.payload.modelName]: state.pagedList[action.payload.modelName].filter(item=>{
            return item[modelPK]!=action.payload[modelPK]
          })
        }
      }
    }


    // GET ITEM
    case 'model/getItem_loading': {
      return {
        ...state,
        itemLoading: true
      }
    }
    case 'model/getItem_success': {
      return {
        ...state,
        itemLoading: false,
        item: action.payload.data
      }
    }
    case 'model/getItem_error': {
      return {
        ...state,
        itemLoading: false
      }
    }


    // SAVE ITEM
    case 'model/saveModel_loading': {
      return {
        ...state,
        saveLoading: true
      }
    }
    case 'model/saveModel_success': {
      return {
        ...state,
        saveLoading: false,
        item: action.payload.data
      }
    }
    case 'model/saveModel_error': {
      return {
        ...state,
        saveLoading: false
      }
    }


    // DELETE ITEM
    case 'model/deleteItem_loading': {
      return {
        ...state,
        deleteLoading: true
      }
    }
    case 'model/deleteItem_success': {
      return {
        ...state,
        deleteLoading: false
      }
    }
    case 'model/deleteItem_error': {
      return {
        ...state,
        deleteLoading: false
      }
    }



    case 'model/resetPagedList': {
      return {
        ...state,
        pagedList: initialState.pagedList
      }
    }




    // DEFAULT
    default:
      return state;

  }
}
