var fs   = require('fs');
var yaml = require('./yamlops.js');
var getdate = require('./getdate.js');
var ini = require('./iniops.js');
var ininpm = require('ini');
var jsonfile = require('jsonfile');
var chokidar = require('chokidar');
var confSet = require('./config.js');
var settings = {};
var iniFiles = [];
var portData = {
  port1: {},
  port2: {},
  port3: {},
  port4: {},
  port5: {},
  port6: {}
};

var loadSettings = function(file, callback, callback2){
  jsonfile.readFile(file, function(err, obj) {
  settings = obj;
  callback(callback2);
  //console.log("The settings for "+settings[username]+" have been loaded");
  })
};

var iniLoader = function(callback) {
  // console.log("The folder being searched is " + settings.iniFolder);
  // for (var i = 1; i <= settings.numPorts; i++){
  //   ini.getPortInis(settings.iniFolder, i);
  // }
  // console.log("The array of inis is returned as:");
  iniFiles = ini.getInis(settings.iniFolder);
  callback(iniFiles);
};

var yamlLoader = function(port) {
  var tempPortName = "port"+port;
  console.log("YAML file loaded from folder " + settings[tempPortName] + ":");
  return yaml.read(settings[tempPortName]);
};

//ROI setter function will take in the array from the latest ini print message and modify it accordingly for the camera config file
// focus chooses PrintMsg Object - 1 = Description, 2 = Barcode, 3 = PLU, 4 = Tracecode, 5 = Country of Origin Labeling
var roiSetter = function(iniObject) {
  //parse the iniObject to get the x and y coord of each print object and return that as a coordinate box to scan for that object's contents in the camera config
  var tempROIArray = [ 0, 0, 640, 0 ];
  var focus = 3;
  //set the starting y value
  printMsgString = "PrintMsg" + iniObject.config.total;
  console.log('Using data from ' + printMsgString);
  yString = "Obj" + focus + "_Y";
  fontString = "Obj" + focus + "_FontSize";
  tempROIArray[1] = iniObject[printMsgString][yString];
  //set the ending y value
  if(focus == 2) {
    tempROIArray[3] = parseInt(iniObject[printMsgString][yString]) + 40;
  } else {
    tempROIArray[3] = parseInt(iniObject[printMsgString][yString]) + parseInt(iniObject[printMsgString][fontString]);
  }
  // console.log("Set ROI y end to " + tempROIArray[3]);
  return tempROIArray;
  // console.log(tempROIArray);
};

var printSetter = function(yamlObject, iniObject, outputYamlFile) {
  //parse the iniObject to get the x and y coord of each print object and return that as a coordinate box to scan for that object's contents in the camera config
  
  // console.log(iniObject);
  //get the latest print message 
  printMsgString = "PrintMsg" + iniObject.config.total;
  console.log('Using data from ' + printMsgString);
  //set barcode ROI
  yamlObject.scanners[0].roi[0] = 0;
  yamlObject.scanners[0].roi[1] = parseInt(iniObject[printMsgString].Obj2_Y);
  yamlObject.scanners[0].roi[2] = 640;
  yamlObject.scanners[0].roi[3] = parseInt(iniObject[printMsgString].Obj2_Y) + 40;
  //set barcode content
  yamlObject.scanners[0].content = iniObject[printMsgString].Obj2_Content;
  //set PLU ROI
  yamlObject.scanners[1].roi[0] = 0;
  yamlObject.scanners[1].roi[1] = parseInt(iniObject[printMsgString].Obj3_Y);
  yamlObject.scanners[1].roi[2] = 640;
  yamlObject.scanners[1].roi[3] = parseInt(iniObject[printMsgString].Obj3_Y) + parseInt(iniObject[printMsgString].Obj3_FontSize);
  //set PLU content
  yamlObject.scanners[1].content = iniObject[printMsgString].Obj3_Content;
  console.log("Writing out to yaml file");
  //output to yaml
  yaml.write(outputYamlFile, yamlObject);
};

var getLatestList = function(fullIniList){
  var sortedList = new Object;

  fullIniList.forEach(function (file) {
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
  console.log("The latest file for each port:");
  console.log(sortedList);
  return sortedList;
};

// Initialize the Settings, IniList, and List of latest Ini Files
var initialize = function(){
  loadSettings('./config/config.json', iniLoader, getLatestList);
};
// Load .yaml config data into each port object
if(settings.globalConfig) {
  portData.forEach(function(port){
    port.yamlData = yaml.read(settings.globalConfig);
  })
} else {
  var count = 1;
  portData.forEach(function(port){
    port.yamlData = yamlLoader(count);
    count = count + 1;
  })
};

console.log(portData);

initialize();

//----------------------------------------// TEST COMMANDS //----------------------------------------//
//loadSettings('./config/config.json', iniLoader, getLatestList);
//iniLoader();
//console.log(iniFiles);
//printSetter(yaml.read('./files/config.yaml'), ininpm.parse(fs.readFileSync('./files/Msg_Port4_20170130.ini', 'utf-8')), './files/testWrittenYaml.yaml');
//loadSettings('./config/config.json', iniLoader);
// loadSettings('./config/config.json', yamlLoader);
//ini.readIni(getdate.today(),2)
//console.log(settings.password)
// yaml.read('./files/config.yaml');
// console.log(getdate.today());
//ini.readIni(getdate.today(),4);
//ini.parseIni('./files/Msg_Port4_20170130.ini');
//ini.parseIniCB('./files/Msg_Port4_20170130.ini',roiSetter);
//roiSetter(ini.parseIni('./files/Msg_Port4_20170130.ini'),3);
// ini.getPortInis('./files',5);
// var temp = json.read('./data.json');
// console.log(temp);
//iniLoader();

