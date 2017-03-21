var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:4569';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var client = io.connect(socketURL, options);

client.emit('updatePi', {
  client: '4',
  data: {
    someValue: 'importantValue'
  }
});
