import { I18n } from 'react-redux-i18n';
import store from 'core/config/store';
import {change} from 'redux-form';



/**
 * CALCULATE TOTAL PAGES
 * @description Receives count and perPage and returns totalPages
 * @param count
 * @param perPage
 * @returns int
 */
export function calculateTotalPages(count, perPage) {
    var totalPages;
    if(count && perPage) totalPages = Math.ceil(count / perPage);
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
  for(var i in keys) {
    obj[keys[i]] = obj[keys[i]] || {};
    obj = obj[keys[i]]; // updating reference
  }
  obj[last] = val; // set the value
}


/**
 * Converts images to base64 by their url
 */
export function imageUrlToBase64(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.send();
}


/**
 * Evaluate variable
 * @description If the variable exists, return the value, if not, return undefined
 */
export function evalState(string, state) {
  /* eslint no-unused-vars: 0 */
  try {
    return eval(string)
  } catch(err) {
    return undefined;
  }
}



/**
 * Generate Validation Errors
 * @description Transforms validationAttributes from server to Redux Form Validation Errors
 */
export function generateValidationErrors(invalidAttributes) {
  const errors = {...invalidAttributes};
  Object.keys(errors).forEach(attr=> {
    errors[attr] = I18n.t('validation.'+errors[attr][0].rule);
  });
  return errors;
}


/**
 * Build Fields
 */
export function fieldBuild(values, {items, separator=' ', filter}) {

  function toSlug(text) {
    return text.trim().toLowerCase().replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i').replace(/ș/g, 's').replace(/ț/g, 't').replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  }

  function toCamelCase(text) {
    return toSlug(text).split('-').map((i,k)=>k==0?i:i.charAt(0).toUpperCase()+i.slice(1)).join('');
  }

  function outputFilter(input) {
    if (filter == 'toSlug') return toSlug(input);
    else if (filter == 'toCamelCase') return toCamelCase(input);
    else return input;
  }

  return outputFilter(items.map(i => values[i] || '').join(separator));
}


export function formFieldBuild(formName, {fieldName, separator, items, filter}, oldValues) {

  if(!(store.getState().form[formName] && store.getState().form[formName].values)) return;

  const newValues =  store.getState().form[formName].values;

  let isValid = false;
  items.forEach(item=>{
    if(oldValues[item]!=newValues[item]) isValid = true;
  });

  const output = fieldBuild(newValues, {items, separator, filter});

  if(!isValid) return;

    // function typeFilter(field) {
  //   var type = config.models[model].fields[field].edit && config.models[model].fields[field].edit.type ? config.models[model].fields[field].edit.type  : 'text';
  //   if (type == 'date') return $filter('date')(isolatedModel[field], 'dd.MM.yyyy');
  //   else return isolatedModel[field];
  // }



  if(oldValues[fieldName]!=newValues[fieldName] || newValues[fieldName]==output) return;

  store.dispatch(change(formName, fieldName, output));

}


/**
 * Set query params
 */
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
 * Listen to Location
 * @returns unlistener function
 */
export function listenToLocation(cb, that) {
  const { router, location: {query} } = store.getState().main;
  let lastQuery = {...query};
  return router.listen(location=>{
    if(!_.isEqual(lastQuery, location.query) && lastQuery.type == location.query.type) {
      setTimeout(()=>{ // to wait for props to be updated
        if(!that._calledComponentWillUnmount) cb();
      });
    }
    lastQuery = location.query;
  });
}



export function getModelPrimaryKey(modelName) {
  if(!modelName) return;
  const { models } = store.getState().main;
  return models[modelName].config.primaryKey;
}
