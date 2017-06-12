const initialState = {
  list: null,
  item: null,
  featuredList: null,
  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {


    // ARTICLE LIST
    case 'article/getPagedList_loading':
      return {
        ...state,
        loading: true
      };
    case 'article/getPagedList_success':
      return {
        ...state,
        list: action.payload.data.list,
        totalPages: action.payload.data.meta.paginate.totalPages,
        loading: false
      };
    case 'article/getPagedList_error':
      return {
        ...state,
        list: null,
        loading: false
      };


    // FEATURED ARTICLE LIST
    case 'article/getFeaturedList_success':
      return {
        ...state,
        featuredList: action.payload.data
      };


    // TAG LIST
    case 'article/getTagList_success':
      return {
        ...state,
        tagList: action.payload.data
      };


    // SINGLE ARTICLE
    case 'article/getItem_success':
      return {
        ...state,
        item: action.payload.data
      };
    case 'article/getItem_error': {
      return {
        ...state,
        item: {notFound: true}
      };
    }


    case 'article/resetItem':
      return {
        ...state,
        item: initialState.item
      };


    default:
      return state;
  }
}