const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');



allCircles = []


const HTML_DIR = path.join(__dirname, '/static/')
app.use(express.static(HTML_DIR))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {

    // —MVP:—
    // DONE create new circle on connection
    // DONE append circle to all circles list
    // DONE delete circle from list on disconnect

    // TODO load in all circles
    // TODO allow all circles to move
        // *note: make sure user can control only their circle on connection
    // TODO allow for collision detection
    // TODO add dots that grow circle

    // —EXTRA:—
    // allow users to create username
    // have a restart button or function


    socket.on('createPlayer', (circleData, username) => {
        circleData.socketId = socket.id;
        circleData.playerUsername = username;
        // circleData.username = username;
        allCircles.push(circleData);

        console.log(circleData);
        console.log(allCircles);

        // emits connection message to all users
        io.sockets.emit('connectMsg', username);
        // io.sockets.emit('drawCircles', allCircles);

        // draw game only for current socket
        socket.emit('drawGame', allCircles);

        // // place player on all other sockets games
        // socket.broadcast.emit('placePlayer');

        // socket.broadcast.emit('place-me-at-all-clients-screen', data);
        // socket.emit('place-all-clients-to-my-screen', onlineCircles);
        // socket.emit('place-all-foods', foods);
    });


    // remove circle from array on disconnect
    socket.on('disconnect', function() {
        console.log(`${socket.id} disconnected`);
        allCircles.forEach(element => {
            if (element.socketId == socket.id) {
                const index = allCircles.indexOf(element);
                allCircles.splice(index, 1);
                console.log(`${socket.id} circle removed!`)
            };
        });
    });
    
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});