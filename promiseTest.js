var fs   = require('fs');
var Promise = require("bluebird");
var jsonfile = require('jsonfile');
var ini = require('./iniops.js');
var ininpm = require('ini');
var settings = {};
var iniFiles = null;
var yamlTemplate = null;
//var portYamls = {}; //NOT CURRENTLY USED - For individual port yaml configurations
var configFile = './config/config.json';
var yaml = require('./yamlops.js');
var chokidar = require('chokidar');

// Loads the setting file from the configFileLoc variable and passes it on
var loadSettings = function(configFileLoc){
  return new Promise(function(resolve, reject){
    jsonfile.readFile(configFileLoc, function(err, configSettings){
      if(configSettings){
        settings = configSettings;
        console.log('Settings were loaded: ');
        console.log(configSettings);
        if(settings.globalYaml){
          yamlTemplate = yaml.read('./files/config.yaml');
        }
        resolve(configSettings);
      } else {
        console.log(err);
        reject('Failure: Couldnt load the file');
      }
    });
  })
};

// Takes in a settings object and loads the array of ini files based on the iniFolder location in settings
var iniLoader = function(settingObj){
  return new Promise(function(resolve, reject){
    iniFiles = ini.getInis(settingObj.iniFolder);
    //if(settings.iniFolder == settingObj.iniFolder){console.log("the ini lists match!");}
    if(iniFiles){
      resolve(iniFiles);
    } else {
      reject('Error: Unable to populate the list of .ini Files during initialization');
    }
  })
};

// var loadYamlTemplate = function _loadYamlTemplate(){
//   return new Promise(function(resolve, reject){
//     if(settings.globalYaml){

//     }
//   })
// };


// Takes in a list of ini files and parses the filenames to find out which ones are the latest based on date and returns the subset of just the latest ini file for each port as an object list
// The passed on list will contain objects in the form:
// PortX: {date: '20171231', fileName: 'Msg_PortX_20171231.ini' }
var latestIniParser = function(fullIniList){
  return new Promise(function(resolve, reject){
    var sortedList = new Object;
    fullIniList.forEach(function(file){
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
    if (sortedList) {
      iniFiles = sortedList;
      resolve(sortedList);
    } else {
      reject('Error: Couldn\'t get a list of latest inis from the full list');
    }
  })
};

//GET THE YAML FILE FOR SPECIFIED PORT - if settings point to a global yaml, check if it's loaded. If loaded, pass it on - If not loaded, load the global yaml, store it in the global object, and pass it along. If settings are not local, get read in the yaml object from the specified file and pass along that object.
var yamlLoader = function(port){  
  var tempPortName = port;
  return new Promise(function(resolve, reject){
    console.log("Checking yaml config settings for " + settings[tempPortName] + ":");
    if(settings.globalYaml){
      if(yamlTemplate){
        resolve(yamlTemplate);
      } else {
        var yamlFile = yaml.read('./files/config.yaml');
        if(yamlFile){
          resolve(yamlFile);
        } else {
          reject('Error: Unable to load the global yaml file at ./files/config.yaml');
        }
      }
    } else {
      var yamlFile = yaml.read(settings[tempPortName].config);
      if(yamlFile){
        resolve(yamlFile);
      } else {
        reject('Error: Unable to load yaml file ' + settings[tempPortName]);
      }
    }
  })
};

// NOT CURRENTLY USED - ADDING FUNCTIONALITY FOR INDIVIDUAL PORT YAML CONFIGURATION SETTINGS
var checkYamlConfig = function(iniPort, settings){
    console.log("Port 2 target:");
    console.log(settings[iniPort].target);
    if(settings.globalYaml){
      console.log('Yaml configuration is global');
      console.log('Global config is:');
      console.log(yamlTemplate);
    } else {
      console.log('Yaml configuration is individual based on port');
    }
    var tempYamlConfigPath = './' + iniPort + '/config.yaml';
    console.log(tempYamlConfigPath);
    //yaml.read(tempYamlConfigPath);
};

// var mapIniToYaml = function(iniFileName, iniPort){


// };

//Takes in an ini Path and resolves an ini Object that contains an iniPath path string and a iniContents object
var readIniProm = function _readIniProm(iniPath) {
  return new Promise(function(resolve, reject){
    ininpm.parse(fs.readFileSync(iniPath, 'utf-8'))
    if(iniPath){
      fs.readFile(iniPath, 'utf-8', (err, data) => {
        if(err){
          reject('There was an error reading the file located at ' + iniPath);
        } else {
          resolve({'iniPath': iniPath, 'iniContents': ininpm.parse(data)});
        }
      })
    } else {
      reject('The ini path,' + iniPath + ' was invalid.');
    }
    
  })
};

var mapIniYaml = function _mapIniYaml(iniObject){
  return new Promise(function(resolve, reject){
    var yamlObject = new Object;
    if(yamlTemplate){
      yamlObject = yamlTemplate;
    } else {
      reject('Couldn\'t find Yaml template to use');
    }
    printMsgString = "PrintMsg" + iniObject.iniContents.config.total;
    //set barcode ROI
    yamlObject.scanners[0].roi[0] = 0;
    yamlObject.scanners[0].roi[1] = parseInt(iniObject.iniContents[printMsgString].Obj2_Y);
    yamlObject.scanners[0].roi[2] = 640;
    yamlObject.scanners[0].roi[3] = parseInt(iniObject.iniContents[printMsgString].Obj2_Y) + 40;
    //set barcode content
    yamlObject.scanners[0].content = iniObject.iniContents[printMsgString].Obj2_Content;
    //set PLU ROI
    yamlObject.scanners[1].roi[0] = 0;
    yamlObject.scanners[1].roi[1] = parseInt(iniObject.iniContents[printMsgString].Obj3_Y);
    yamlObject.scanners[1].roi[2] = 640;
    yamlObject.scanners[1].roi[3] = parseInt(iniObject.iniContents[printMsgString].Obj3_Y) + parseInt(iniObject.iniContents[printMsgString].Obj3_FontSize);
    //set PLU content
    yamlObject.scanners[1].content = iniObject.iniContents[printMsgString].Obj3_Content;
    //output yaml object
    if(yamlObject){
      resolve({'iniPath': iniObject.iniPath, 'yamlContents': yamlObject});
    } else {
      reject('Could not generate the YAML object');
    }
  })
};

var outputYaml = function(yamlObject){
  return new Promise(function(resolve, reject){
    var port = yamlObject.iniPath.slice(yamlObject.iniPath.indexOf("_") + 1, yamlObject.iniPath.lastIndexOf("_"));
    console.log('Attempting yaml generation for' + port);
    if(settings[port].target){
      yaml.write(settings[port].target, yamlObject.yamlContents)
      resolve('Wrote the contents to ' + port);
    } else {
      reject('Couldn\'t find a target locations for ' + port);
    }
    
  })
};

// var generateYaml = function(yamlObject){
//   checkYamlConfig(iniFile).then(getIniContents).then(iniToYaml).then(outputYaml).catch(console.log);
// };

var iniListTrigger = function(iniList){
  // for (var x=1; x <= settings.numPorts; x++){
  //   var tempPortName = 'Port' + x;
  //   if (iniList[tempPortName]){
  //     console.log(tempPortName + ' data was found... proceeding');
  //     console.log(settings[tempPortName].config + ' will be loaded and output to ' + settings[tempPortName].target);
  //   } else {
  //     console.log('WARNING: ' + tempPortName + ' ini file wasn\'t found');
  //   }
  // }
  Object.keys(iniList).forEach(function(key, index){
    console.log('key: ' + key);
    console.log('index: ' + index);
    console.log('date: ' + iniList[key].date);
    console.log('file: ' + iniList[key].fileName);


  })
};

var runAfterInit = function _runAfterInit(){
  readIniProm('./files/Msg_Port5_20160307.ini')
  .then(mapIniYaml)
  .then(outputYaml)
  .then(console.log)
  // .then((yamlObject) => {
  //   console.log('The path is ' + yamlObject.iniPath); 
  //   console.log('The contents are:'); 
  //   console.log(yamlObject.yamlContents);
  //   console.log('ROI contents are:');
  //   console.log(yamlObject.yamlContents.scanners[0].roi);
  //   console.log('and');
  //   console.log(yamlObject.yamlContents.scanners[1].roi);
  // })
  .catch(console.log);
};

var watcher = function _watcher(){
  if(settings.iniFolder){
    console.log('Watching for file changes in ' + settings.iniFolder);
    chokidar.watch(settings.iniFolder, {ignored: /[\/\\]\./, ignoreInitial: true})
    .on('add', (path) => {
      console.log('the path is ' + path);
      console.log('port of file is ' + path[19]);
      console.log('date of file is ' + path.slice(21,29));
    })
    .on('change', (path) => {
      console.log('the path is ' + path);
      console.log('port of file is ' + path[19]);
      console.log('date of file is ' + path.slice(21,29));
    });
  } else {
    console.log('error: couldn\'t find the .ini folder in settings');
  }
  
}

loadSettings(configFile).then(watcher).catch(console.log);
//loadSettings(configFile).then(iniLoader).then(latestIniParser).then(iniListTrigger).catch(console.log);
//checkYamlConfig(iniFiles, settings);


//Promise string: Load settings and configuration then call individual output functions