function checkIfImageExists(Model, filename, cb) {
  Model.findOne({filename: filename}).then(function(item) {
    cb(!!item);
  })
}

function getCopyIndex(filenameBody) {

  const indexOfLine = filenameBody.lastIndexOf('-');
  if(indexOfLine === -1) return;

  const possibleCopyIndex = filenameBody.substring(indexOfLine+1);
  const indexOfC = possibleCopyIndex.indexOf('c');
  if(indexOfC !== 0) return;

  const copyIndexString = possibleCopyIndex.substring(indexOfC+1);
  let copyIndexInt = parseInt(copyIndexString);
  if(copyIndexString !== copyIndexInt) return;

  return ++copyIndexInt;

}

function riseCopyIndex(filename) {

  const lastIndexOfPoint = filename.lastIndexOf('.');
  let filenameBody = filename.substring(0, lastIndexOfPoint);
  const extension = filename.substring(lastIndexOfPoint);
  let copyIndex = getCopyIndex(filenameBody);

  if(copyIndex) filenameBody = filenameBody.substring(0, filenameBody.lastIndexOf('-'));
  else copyIndex = 1;

  return filenameBody + '-c' + copyIndex + extension;

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
