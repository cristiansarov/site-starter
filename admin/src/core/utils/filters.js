/**
 * HIGHLIGHT TEXT
 * @description Highlights text with span.highlighed using a string query
 * @param text
 * @param query
 * @returns html
 */
export function highlight(text, query) {
    if(query) {
        var pattern = new RegExp('('+query+')', 'gi');
        return text.replace(pattern, '<span class="highlighted">$1</span>');
    } else return text;
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
    input = String(input).replace(/<[^>]+>/gm, '');
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
 * Filter list by list
 * @param list1
 * @param list2
 * @param prop
 * @returns filtered list
 */
export function filterListByList(list1, list2, prop='id') {
  const idList = list2.map(item => item[prop]);
  return list1.filter(item=>!idList.includes(item[prop]));
}


/**
 * GET IMAGE URL
 * @description gets full image url from filename [and image size]
 * @param filename
 * @param size
 * @returns {*}
 */
export function imageUrl(filename, size) {
  if(size) return `${window.location.origin}/images/${size}/${filename}`;
  return `${window.location.origin}/images/${filename}`;
}


/**
 * First Letter to LowerCase
 * @param string
 * @returns {string}
 */
export function firstLetterLowerCase(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}