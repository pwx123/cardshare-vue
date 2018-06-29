var socketio = {}
var socketIO = require('socket.io')

var SENDER = {}
socketio.getSocketio = function(server) {
  var io = socketIO.listen(server)

  io.sockets.on('connection', (socket) => {
    socket.on('startSend', (value) => {
      if (!value) {
        socket.emit('err', 'value is null')
      } else {
        SENDER[value.user] = {
          socketId: socket.id,
          shareId: value.shareId,
          card: value.card
        }
      }
    })

    socket.on('startReceive', (value) => {
      if (!value) {
        socket.emit('err', 'value is null')
      } else {
        for (let index in SENDER) {
          if (SENDER[index].shareId === value.shareId) {
            socket.emit('receiveCard', {
              senduser: index,
              card: SENDER[index].card
            })
            return
          }
        }
        socket.emit('err', 'shareId is error')
      }
    })

    socket.on('disconnect', () => {
      for (let i in SENDER) {
        if (SENDER[i].socketId === socket.id) {
          delete SENDER[i]
        }
      }
    })
  })
}

module.exports = socketio
