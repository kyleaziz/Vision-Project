//Require files for reading in and parsing .ini from Anser Software
var fs = require('fs');
var ini = require('ini');
var moment = require('moment');

//Read in and parse the .ini file - specifically looking at DATA.ini to start but need to update to read all files in Anser directory
var printer = ini.parse(fs.readFileSync('./files/DATA.ini', 'utf-8'));

//Initialize which print message to read based off of total provided in ini config file
var latestMsg = "PrintMsg";
latestMsg += printer.config.total.toString();

//Check the types on the objects in the latest print message
for (i=1;i<=printer[latestMsg].ObjectCount;i++){
  //Generate field name for Object
  var typeFocus = "Obj"+i+"_Type";
  var contentFocus = "Obj"+i+"_Content";

  //Output PLUs and Barcodes

  if(printer[latestMsg][typeFocus] == "LogoText" && !isNaN(printer[latestMsg][contentFocus])) {
    console.log("Latest message contains the PLU "+ printer[latestMsg][contentFocus]);
  }

  if(printer[latestMsg][typeFocus] == "Barcode") {
    console.log("Latest message contains the Barcode "+ printer[latestMsg][contentFocus]);
  }
}

//Identify if a LogoText Object is a PLU or just text


//Output the objects



//read in a specific file given a date and port
exports.readini = function(date, port) {
  var prename = 'Msg_Port';
  var filename = "Msg_Port"+port+"_"+date+".ini"
  console.log("Attempting read from file: "+filename);
}


