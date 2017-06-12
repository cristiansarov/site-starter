import axios from 'axios';

export function getPagedList({page, tagSlug}) {
  return {
    type: 'article/getPagedList',
    payload: axios.get('/getPagedArticleList', {params: {
      page,
      tagSlug
    }})
  };
}

export function getItem(slug) {
  return {
    type: 'article/getItem',
    payload: axios.get(`/getArticle/${slug}`)
  };
}

export function getFeaturedList() {
  return {
    type: 'article/getFeaturedList',
    payload: axios.get('/getFeaturedArticleList')
  };
}

export function getTagList() {
  return {
    type: 'article/getTagList',
    payload: axios.get('/getTagList')
  };
}

export function resetItem() {
  return {
    type: 'article/resetItem'
  }
}