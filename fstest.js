var fs = require('fs');

// fs.readFileSync('./files/badpath.ini', 'utf-8', (err, data) => {
//     if (err) {
//       console.log("The file didn't load.");
//       console.log(err);
//       console.log("Post error message.");
//     }
//     console.log(data);
// });

fs.readFile('./files/DATA.ini', (err, data) => {
  if (err) {
    console.log("Could find a file at " + err.path);
    console.log('Checking for the latest file instead..')
  } else {
    console.log(data);
    return data;
  }
});