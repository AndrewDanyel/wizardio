const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let players = {};

io.on('connection', socket => {
  console.log('A user connected:', socket.id);

  players[socket.id] = { x: 100, y: 100, angle: 0 };

  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

  // ✅ only one listener per socket
  socket.on('move', data => {
    if (players[socket.id]) {
      players[socket.id] = { ...players[socket.id], ...data };
      socket.broadcast.emit('playerMoved', { id: socket.id, ...data });
    }
  });

  // ✅ only one chat listener here
  socket.on('chatMessage', msg => {
    io.emit('chatMessage', {
      id: socket.id,
      message: msg
    });
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
    console.log('A user disconnected:', socket.id);
  });
});


http.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
