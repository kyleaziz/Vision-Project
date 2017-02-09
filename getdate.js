var fs = require('fs');
var moment = require('moment');
//var d = moment().format('YYYYMMDD');
//console.log(d);

exports.today = function() {
  return moment().format('YYYYMMDD');
}
