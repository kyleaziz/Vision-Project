//Require files for reading in and parsing .ini from Anser Software
var fs = require('fs');
var ini = require('ini');
var moment = require('moment');

//Read in and parse the .ini file - specifically looking at DATA.ini to start but need to update to read all files in Anser directory
// var printer = ini.parse(fs.readFileSync('./files/DATA.ini', 'utf-8'));

// //Initialize which print message to read based off of total provided in ini config file
// var latestMsg = "PrintMsg";
// latestMsg += printer.config.total.toString();

// //Check the types on the objects in the latest print message
// for (i=1;i<=printer[latestMsg].ObjectCount;i++){
//   //Generate field name for Object
//   var typeFocus = "Obj"+i+"_Type";
//   var contentFocus = "Obj"+i+"_Content";

//   //Output PLUs and Barcodes

//   if(printer[latestMsg][typeFocus] == "LogoText" && !isNaN(printer[latestMsg][contentFocus])) {
//     console.log("Latest message contains the PLU "+ printer[latestMsg][contentFocus]);
//   }

//   if(printer[latestMsg][typeFocus] == "Barcode") {
//     console.log("Latest message contains the Barcode "+ printer[latestMsg][contentFocus]);
//   }
// }

//Identify if a LogoText Object is a PLU or just text


//Output the objects



//read in a specific file given a date and port
exports.readIni = function(date, port) {
  var filename = "./files/Msg_Port"+port+"_"+date+".ini"
  console.log("Attempting read from file: " + filename);
  fs.readFile(filename, (err, data) => {
    if (err) {
      console.log("Could not find a file at " + err.path);
      console.log('Checking for the latest file instead..')
    } else {
      console.log("Reading data from file " + filename);
      return data;
    }
  });
}

exports.parseIni = function(file) {
  console.log(ini.parse(fs.readFileSync(file, 'utf-8')));
}

exports.parseIniCB = function(file, callback) {
  callback(ini.parse(fs.readFileSync(file, 'utf-8')));
}

exports.getInis = function(dir) {
  var files = fs.readdirSync(dir);
  var iniList = [];
  for (file in files) {
    if (files[file].search(/Port/i) >= 0) {
      // console.log(files[file]);
      iniList.push(files[file]);
    }
  }
  //console.log("The list of .ini files returned is: " + iniList);
  return iniList;
}

exports.getPortInis = function(dir, port) {
  var files = fs.readdirSync(dir);
  console.log("The following files are in the directory for Port"+port+":");
  //console.log(files);

  var portregex = new RegExp("Port"+port,"i")

  for (file in files) {
    if (files[file].search(portregex) >= 0) {
      console.log(files[file]);
    }
  }

  console.log(' ');
}

exports.getLatestData = function (file){
  var printFile = ini.parse(fs.readFileSync(file, 'utf-8'));

  //Initialize which print message to read based off of total provided in ini config file
  var latestMsg = "PrintMsg";
  latestMsg += printFile.config.total.toString();

  //Check the types on the objects in the latest print message
  for (i=1;i<=printFile[latestMsg].ObjectCount;i++){
    //Generate field name for Object
    var typeFocus = "Obj"+i+"_Type";
    var contentFocus = "Obj"+i+"_Content";

    //Output PLUs and Barcodes

    if(printFile[latestMsg][typeFocus] == "LogoText" && !isNaN(printer[latestMsg][contentFocus])) {
      console.log("Latest message contains the PLU "+ printer[latestMsg][contentFocus]);
    }

    if(printFile[latestMsg][typeFocus] == "Barcode") {
      console.log("Latest message contains the Barcode "+ printer[latestMsg][contentFocus]);
    }
  }
}

exports.printLatestData = function (file){
  var printFile = ini.parse(fs.readFileSync(file, 'utf-8'));

  //Initialize which print message to read based off of total provided in ini config file
  var latestMsg = "PrintMsg";
  latestMsg += printFile.config.total.toString();

  //Check the types on the objects in the latest print message
  for (i=1;i<=printFile[latestMsg].ObjectCount;i++){
    //Generate field name for Object
    var typeFocus = "Obj"+i+"_Type";
    var contentFocus = "Obj"+i+"_Content";

    //Output PLUs and Barcodes

    if(printFile[latestMsg][typeFocus] == "LogoText" && !isNaN(printer[latestMsg][contentFocus])) {
      console.log("Latest message contains LogoText (maybe a PLU) "+ printer[latestMsg][contentFocus]);
    }

    if(printFile[latestMsg][typeFocus] == "Barcode") {
      console.log("Latest message contains the Barcode "+ printer[latestMsg][contentFocus]);
    }
  }
}
