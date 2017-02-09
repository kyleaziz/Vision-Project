var jsonfile = require('jsonfile')
var file = './config.json'


// jsonfile.readFile(file, function(err, obj) {
//   console.dir(obj)
// })

exports.read = function(file){
  jsonfile.readFile(file, function(err, obj) {
  return obj;
  })
  //return obj
}