const XLS = require('xlsx');

function getJson(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var sheet = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], {header: 1});
    if(sheet.length > 0) {
      var newSheet = [];
      sheet.forEach(function(row) {
        if(row.length) {
          row.forEach(function(item, k) {
            if(typeof item == 'string') row[k] = item.trim();
          });
          newSheet.push(row);
        }
      });
      result[sheetName] = newSheet;
    }
  });
  return result;
}



export {getJson};
