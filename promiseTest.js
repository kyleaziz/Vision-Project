var Promise = require("bluebird");
var jsonfile = require('jsonfile');
var ini = require('./iniops.js');
var settings = {};
var iniFiles = null;
var configFile = './config/config.json';

var loadSettings = function(configFileLoc){
  return new Promise(function(resolve, reject) {
    jsonfile.readFile(configFileLoc, function(err, configSettings) {
      if(configSettings) {
        settings = configSettings;
        console.log(configSettings);
        resolve(configSettings);
      } else {
        console.log(err);
        reject('Failure: Couldnt load the file');
      }
    });
  })};

var iniLoader = function(settingObj){
  return new Promise(function(resolve, reject) {
  iniFiles = ini.getInis(settingObj.iniFolder);
    if(settings.iniFolder == settingObj.iniFolder){console.log("the ini lists match!");}
    if(iniFiles){
      resolve(iniFiles);
    } else {
      reject('Error: Unable to populate the list of .ini Files during initialization');
    }
  })
};


// function() {
//   console.log("The folder being searched is " + settings.iniFolder);
//   console.log("The array of inis is returned as:");
//   iniFiles = ini.getInis(settings.iniFolder);
// };

// loadSettings('./config/config.json', iniLoader)
loadSettings(configFile).then(iniLoader).then(list => console.log(list)).catch(console.log);