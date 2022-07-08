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
        circleData._id = socket.id;
        circleData.playerUsername = username;
        playerCircle = circleData;
        allCircles.push(playerCircle);
        
        console.log(playerCircle);
        console.log(allCircles.length);

        // emits connection message to all users
        socket.broadcast.emit('connectMsg', username);

        // place all other circles onto the current socket's screen
        socket.emit('downloadCircles', allCircles, socket.id);

        // place circle at all other socket screens
        socket.broadcast.emit('uploadCircle', playerCircle);
        
        // socket.emit('place-all-foods', foods);
    });

    socket.on('moveMouse', function(data) {
        // moves player circle
        // io.sockets.emit('moveCircles', {session_id: socket.id, coords: data, playerCircle: playerCircle})
        console.log('moving')
        // broadcasts & moves circle on other people's socket
        socket.broadcast.emit('moveCircles', data, socket.id);
    });


    // remove circle from array on disconnect
    socket.on('disconnect', function() {
        console.log(`${socket.id} disconnected`);
        allCircles.forEach(element => {
            if (element._id == socket.id) {
                const index = allCircles.indexOf(element);
                allCircles.splice(index, 1);
                console.log(`${socket.id} circle removed!`)
            };
        });
        socket.broadcast.emit('disconnectPlayer', socket.id)
    });
    
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});