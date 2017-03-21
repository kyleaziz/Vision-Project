var io = require('socket.io')(4569);

let assocArray = {};

function findClientsSocketByRoomId(roomId) {
  var res = [], room = io.sockets.adapter.rooms[roomId];
  if (room) {
    for (var id in room) {
      res.push(io.sockets.adapter.nsp.connected[id]);
    }
  }
  return res;
}

io.on('connection', function (socket) {
  socket.on('register', function (portNumber) {
    if (io.sockets.connected[socket.id]) {
      io.sockets.connected[socket.id].portNumber = portNumber;
      console.log('Registered Client => ', portNumber);
    }
  });

  socket.on('updatePi', function (data) {
    let piToUpdate;
    let connectedSockets = io.sockets.connected;
    for (var key in connectedSockets) {
      if (connectedSockets.hasOwnProperty(key)) {
        if(connectedSockets[key].portNumber == data.port) {
          piToUpdate = connectedSockets[key];
          break;
        }
      }
    }

    if(piToUpdate) {
      piToUpdate.emit('updatePi', {
        client: data.port,
        data: data.data
      });
    }
  });

  socket.on('disconnect', function () {
    if (io.sockets.connected[socket.id]) {
      console.log('Disconnect from port ', io.sockets.connected[socket.id].portNumber);
    }
  });
});
