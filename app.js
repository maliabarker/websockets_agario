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

    // MVP:
    // create new circle on connection
    // append circle to all circles list
    // load in all circles
    // allow all circles to move
    // delete circle from list on disconnect

    // EXTRA:
    // allow users to create username
    // add food to grow circle
    // allow for collision detection
    // have a restart button or function

    // TODO: create new circle for each user on connection 
    // *note: make sure user can control only their circle on connection

    console.log(`${socket.id} connected`);

    // emits connection message to all users
    io.sockets.emit('connect message', socket.id);

    socket.on('new circle', (circleData) => {
        circleData.socketId = socket.id;
        allCircles.push(circleData);

        console.log(circleData);
        console.log(allCircles);

        // socket.broadcast.emit('place-me-at-all-clients-screen', data);
        // socket.emit('place-all-clients-to-my-screen', onlineCircles);
        // socket.emit('place-all-foods', foods);
    });

    // only emits to single user's server
    // socket.emit('new circle')


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

    // for emitting connection msg to all users
    // socket.on('new connection', (msg) => {
    //     console.log('message: ' + msg);
    //     io.emit('new connection', msg);
    // });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

module.exports = io