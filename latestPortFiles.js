var ini = require('./iniops.js');

var list = ini.getInis('./files/inis')
var sortedList = new Object;

list.forEach(function (file) {
  var port = file.slice(file.indexOf("_") + 1, file.lastIndexOf("_"));
  var fileDate = parseInt(file.slice(file.lastIndexOf("_") + 1, file.indexOf(".")));
  if (sortedList[port]) {
    var oldDate = sortedList[port].date;
    if (oldDate < fileDate) {
      sortedList[port].date = fileDate;
      sortedList[port].fileName = file;
    }
  } else {
    sortedList[port] = {};
    sortedList[port].date = fileDate;
    sortedList[port].fileName = file;
  }
})

// console.log("the sorted list is: ");
console.log(sortedList);
