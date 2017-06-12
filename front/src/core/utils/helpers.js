import store from '../../core/config/store';
import _ from 'lodash';
import React from 'react';



/**
 * CALCULATE TOTAL PAGES
 * @description Receives count and perPage and returns totalPages
 * @param count
 * @param perPage
 * @returns int
 */
export function calculateTotalPages(count, perPage) {
    var totalPages;
    if (count && perPage) totalPages = Math.ceil(count / perPage);
    else totalPages = 1;
    return totalPages;
}


/**
 * String to Object Value
 * @description gets properties of an object by a string
 */
export function stringToObjectValue(s, o) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}


/**
 * Set object deep value
 */
export function setObjectDeepValue(obj, keys, val) {
    keys = keys.split('.');
    var last = keys.pop(); // get the last element off.
    for (var i in keys) {
        obj[keys[i]] = obj[keys[i]] || {};
        obj = obj[keys[i]]; // updating reference
    }
    obj[last] = val; // set the value
}


/**
 * Evaluate variable
 * @description If the variable exists, return the value, if not, return undefined
 */
/*eslint-disable*/
export function evalState(string, state) {
    try {
        return eval(string)
    } catch (err) {
        return undefined;
    }
}
/*eslint-enable*/



/**
 * HTML function - converts string to html
 * @param html
 */
export function html(html) {
  return <span dangerouslySetInnerHTML={{__html: html}}/>;
}



export function setQueryParam(name, value) {
  const { routes, params, location, router } = store.getState().main;
  const route = routes[routes.length-1];
  const query = {...location.query};
  if ([undefined, null, false].includes(value)) delete query[name];
  else query[name] = value;
  if(name!='page') delete query.page;
  router.replace({name: route.name, params, query});
}


/**
 * SCROLL TO ELEMENT
 * @param ref
 */
export function scrollToElement(ref) {
  var scroll = require('scroll-to');
  scroll(0, ref.offsetTop)
}



/**
 * Listen to Location
 * @returns unlistener function
 */
export function listenToLocation(cb, that) {
  if(typeof window == 'undefined') return new Promise(()=>{}); // for SSR
  const { router, location: {query} } = store.getState().main;
  let lastQuery = {...query};
  return router.listen(location=>{
    if(!_.isEqual(lastQuery, location.query) && lastQuery.type == location.query.type) {
      setTimeout(()=>{ // to wait for props to be updated
        if(that._reactInternalInstance) cb();
      });
    }
    lastQuery = location.query;
  });
}


/**
 * SET META TAGS
 * @param metaTags
 */
export function setDocumentMetaTags(metaTags) {
  if(typeof document !=='undefined' && metaTags.title) document.title = metaTags.title;
}