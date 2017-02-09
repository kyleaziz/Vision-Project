// yamlops.js - Provide read and write yaml operations to specific files on the Pi's
var yaml = require('js-yaml');
var fs   = require('fs');

//Read function reads in a .yaml file from the path parameter
exports.read = function(path) {
try {
    var doc = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    //console.log(doc);
    return doc;
  } catch (e) {
    console.log(e);
  }
}

exports.write = function(path, yamlObj) {
try {
    console.log("Attempting to write yaml object to file:" + path);
    fs.writeFile(path, yaml.safeDump(yamlObj), 'utf8', console.log("Yaml file output complete"))
  } catch (e) {
    console.log(e);
  }
}

var readWriteYaml = function(readPath, writePath) {
  try {
    var doc = yaml.safeLoad(fs.readFileSync(readPath, 'utf8'));
    console.log("Safe loaded the Object: ");
    console.log(doc);
    fs.writeFile(writePath, yaml.safeDump(doc), 'utf8', console.log("All done writing!"));
  } catch (e) {
    console.log(e);
  }
}

var readWriteYaml2 = function(readPath, writePath) {
  write(writePath, read(readPath));
}