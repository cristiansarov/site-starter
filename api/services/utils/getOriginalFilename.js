function checkIfImageExists(Model, filename, cb) {
  Model.findOne({filename: filename}).then(function(item) {
    cb(!!item);
  })
}

function getFinalFilenameBody(filenameBody) {

  // test if there is and '-' character
  const indexOfLine = filenameBody.lastIndexOf('-');
  if(indexOfLine === -1) return filenameBody+'-c1';

  // test if the character group is in correct format ('c123')
  const possibleCopyIndex = filenameBody.substring(indexOfLine+1);
  if(!/c\d+/.test(possibleCopyIndex)) return filenameBody+'-c1';

  // rise the index and return the final body
  const currentCopyIndex = parseInt(possibleCopyIndex.replace('c', ''));
  return filenameBody.replace(possibleCopyIndex, 'c' + (currentCopyIndex + 1))

}

function riseCopyIndex(filename) {

  const lastIndexOfPoint = filename.lastIndexOf('.');
  let filenameBody = filename.substring(0, lastIndexOfPoint);
  let finalFilenameBody = getFinalFilenameBody(filenameBody);
  const extension = filename.substring(lastIndexOfPoint);
  return finalFilenameBody + extension;

}

function getOriginalFilename(Model, filename, cb) {
  checkIfImageExists(Model, filename, function(exists) {
    if(exists) {
      filename = riseCopyIndex(filename);
      getOriginalFilename(Model, filename, cb)
    } else cb(filename);
  })
}

module.exports = getOriginalFilename;
