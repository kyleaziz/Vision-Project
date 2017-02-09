//Compare.js
var checkRecency = function(settings, changedPath, callback) {
var portString = "port" + changedPath[19];
console.log(portString);
// //check year
// // if(settings.portDates[(changedPath[19] - 1)] <= )
// console.log(settings.portDates[(changedPath[19] - 1)].toString().slice(0,4));
// console.log(changedPath.slice(21,25));
// console.log(settings.portDates[(changedPath[19] - 1)].toString().slice(0,4) <= changedPath.slice(21,25));
// console.log(settings.portDates[(changedPath[19] - 1)].toString().slice(0,4) >= changedPath.slice(21,25));
  //compare years
  if(settings.portDates[(changedPath[19] - 1)].toString().slice(0,4) <= changedPath.slice(21,25)) {
  //compare month
    if(settings.portDates[(changedPath[19] - 1)].toString().slice(4,6) <= changedPath.slice(25,27)) {
    //compare date
      if(settings.portDates[(changedPath[19] - 1)].toString().slice(6,8) <= changedPath.slice(27,29)) {
        callback('Proceeding with output to yaml from file ' + changedPath);
      } else {
        console.log('Date of currently selected printMsg is greater - skipping file ' + changedPath);
      }
    } else {
      console.log('Month of currently selected printMsg is greater - skipping file ' + changedPath);
    }
  } else {
    console.log('Year of currently selected printMsg is greater - skipping file ' + changedPath);
  }
}

var settings = {"portDates": [20170116, 20161229, 20170116, 20160221, 20170116, 20161229]};
var changed = 'files/inis/Msg_Port4_20170130.ini';

checkRecency(settings, changed, console.log);
