var socketio = {};
var socket_io = require('socket.io');

var SENDER = {};
var RECEIVER = {};
socketio.getSocketio = function (server) {
  var io = socket_io.listen(server);

  io.sockets.on('connection', (socket) => {
    console.log('链接成功');

    socket.on('startSend', (value) => {
      if (!value) {
        socket.emit('err', 'value is null');
      } else {
        SENDER[value.user] = socket.id;
        socket.join('sender'); //房间名
        socket.emit('allReceiver', RECEIVER);
        //socket.emit : emit to just one socket 自己
        //io.sockets.emit : emit to all sockets 所有用户
        console.log(SENDER);
        console.log(RECEIVER);
      }
    });

    socket.on('startReceive', (value) => {
      if (!value) {
        socket.emit('err', 'value is null');
      } else {
        RECEIVER[value.user] = socket.id;
        socket.to('sender').emit('allReceiver', RECEIVER) //房间内转发
        console.log(SENDER);
        console.log(RECEIVER);
      }
    });

    socket.on('sendTo', (value) => {
      if (!value) {
        socket.emit('err', 'value is null');
      } else {
        let id = RECEIVER[value.recuser];
        socket.to(id).emit('receiveCard', {
          senduser: value.senduser,
          card: value.card
        }); //指定socket.id转发
        delete SENDER[value.senduser];
        delete RECEIVER[value.recuser];
      }
    });

    socket.on('disconnect', () => {
      for (i in SENDER) {
        console.log(i);
        if (SENDER[i] == socket.id) {
          delete SENDER[i];
          console.log(i + " disconnect");
        }
      };
      for (i in RECEIVER) {
        console.log(i);
        if (RECEIVER[i] == socket.id) {
          delete RECEIVER[i];
          console.log(i + " disconnect");
        }
      }
    });
  });
};

module.exports = socketio;
