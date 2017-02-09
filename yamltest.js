var yaml = require('js-yaml');
var fs   = require('fs');

exports.read = function(path) {
try {
    var doc = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    console.log(doc);
  } catch (e) {
    console.log(e);
  }
}

exports.writeYaml = function(object, path) {
try {
    var doc = yaml.safeDump(object);
    console.log(doc);

  } catch (e) {
    console.log(e);
  }
}

var readWriteYaml = function(readPath, writePath) {
  try {
    var doc = yaml.safeLoad(fs.readFileSync(readPath, 'utf8'));
    console.log("Safe loaded the Object: ");
    console.log(doc);
    fs.writeFile(writePath, yaml.safeDump(doc), 'utf8', console.log("All done writing yaml!"));
    fs.writeFile('./files/outputTest.json', doc, 'utf8', console.log("All done writing object!"));
    for (var s = 0; s < doc.scanners.length; s++) {
      for (var x = 0; x < 4; x++) {
        console.log("Scanner " + (s + 1) + " ROI " + x + " is " + doc.scanners[s].roi[x]);
      }
      console.log("The ROI object is " + doc.scanners[s].roi);
    }  
  } catch (e) {
    console.log(e);
  }
}

readWriteYaml('./files/config.yaml','./files/testOutput.yaml');
// var file = read('./files/config.yaml')
// console.log(yaml.safeDump);