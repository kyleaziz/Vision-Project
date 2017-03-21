sockets.js

here is client.js

[3:24]  
 ```var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:4569';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var client = io.connect(socketURL, options);

client.on('customMessage', function (data) {
  console.log('Got customMessage ==> ', data);
});
```

[3:24]  
server.js

[3:24]  
 ```var io = require('socket.io')(4569);

var sockets = [];

io.on('connection', function(socket){
  sockets.push(socket);
    socket.broadcast.emit('customMessage', {
      username: 'testname',
      message: 'data'
    });
});```