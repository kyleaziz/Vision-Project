//Production path should be the following:
// 'C://ANSER PRODUCT/Net Commander HD/PrintedMsg'

// Watcher for './files', ignores .dotfiles 
chokidar.watch('./files/inis', {ignored: /[\/\\]\./,
  ignoreInitial: true})
.on('add', (path) => {
  console.log('the path is ' + path);
  console.log('port of file is ' + path[19]);
  console.log('date of file is ' + path.slice(21,29));
})
.on('change', (path) => {
  console.log('the path is ' + path);
  console.log('port of file is ' + path[19]);
  console.log('date of file is ' + path.slice(21,29));
})
;