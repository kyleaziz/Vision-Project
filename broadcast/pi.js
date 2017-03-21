var io = require('socket.io-client');

var client = io.connect('http://0.0.0.0:4569', {
  transports: ['websocket'],
  'force new connection': true
});
var myId = 4;

client.emit('add user', {});

client.on('updatePi', function (data) {
  console.log('Time to Update!');
  if (data.client == myId) {
    console.log('This is for me!');
  }
});
