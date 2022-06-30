const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const { builtinModules } = require('module');

const HTML_DIR = path.join(__dirname, '/static/')
app.use(express.static(HTML_DIR))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // console.log('a user connected');
    socket.emit('new connection', 'user')

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('new connection', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

module.exports = io