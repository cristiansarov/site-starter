import React from 'react';

/**
 * HIGHLIGHT TEXT
 * @description Highlights text with span.highlighed using a string query
 * @param text
 * @param query
 * @returns html
 */
export function highlight(text, query) {
  let finalText;
  if (query) {
    let pattern = new RegExp('(' + query + ')', 'gi');
    finalText = text.replace(pattern, '<span class="highlighted">$1</span>');
  } else finalText = text;
  return <span dangerouslySetInnerHTML={{__html: finalText}}/>
}


/**
 * Filter list by list
 * @param list1
 * @param list2
 * @param prop
 * @returns filtered list
 */
export function filterListByList(list1=[], list2=[], prop='id') {
  const idList = list2.map(item => item[prop]);
  return list1.filter(item=>!idList.includes(item[prop]));
}


/**
 * Filter list by query
 * @param list
 * @param query
 * @param props
 * @returns filtered list
 */
export function filterListByQuery(list, query='', props=['name']) {
  if(!query || !list) return list;
  return list.filter(item=>{
    let isValid = false;
    props.forEach(prop=>{
      if(!item[prop]) return;
      if(item[prop].toLowerCase().indexOf(query.toLowerCase())>-1) isValid = true;
    });
    return isValid;
  });
}


/**
 * STRIP HTML
 * @param input
 * @returns {string}
 */
export function stripHTML(input) {
  return String(input).replace(/<[^>]+>/gm, '');
}


/**
 * EXCERPT TEXT
 * @description Stripts html, and limit the word number based on character number
 * @param input
 * @param chars
 * @param breakOnWord
 * @returns text
 */
export function excerpt(input, chars, breakOnWord) {
    input = stripHTML(input);
    if (isNaN(chars) || chars <= 0) chars = 90;
    if (input && input.length > chars) {
        input = input.substring(0, chars);

        if (!breakOnWord) {
            var lastspace = input.lastIndexOf(' ');
            //get last space
            if (lastspace !== -1) {
                input = input.substr(0, lastspace);
            }
        } else {
            while(input.charAt(input.length-1) === ' ') {
                input = input.substr(0, input.length -1);
            }
        }
        return input + '…';
    }
    return input;
}



/**
 * GET IMAGE URL
 * @description gets full image url from filename [and image size]
 * @param filename
 * @param size
 * @returns {*}
 */
export function imageUrl(filename, size) {
  if(size) return `images/${size}/${filename}`;
  return `images/${filename}`;
}