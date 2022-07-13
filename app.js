const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);
const path = require('path');

var Food = require('./objects')

allCircles = []
allFood = []

// create all food so everyone has the same food
for (let i = 0; i < 50; i++) {
    var food = new Food()
    allFood.push(food)
}


const HTML_DIR = path.join(__dirname, '/static/')
app.use(express.static(HTML_DIR))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    // —MVP:—
    // TODO allow for collision detection
    // TODO remove and add new food when collided
    // TODO grow circle with more points

    // TODO allow collisions for circles so they can 'eat' eachother
    // TODO change velocity with growth
    // TODO create a gameover screen and restart button

    // on create player (new game initiated)
    socket.on('createPlayer', (circleData, username) => {
        circleData._id = socket.id;
        circleData.playerUsername = username;

        playerCircle = circleData;
        allCircles.push(playerCircle);

        // emits connection message to all users
        socket.broadcast.emit('connectMsg', username);

        // place all other circles onto the current socket's screen
        socket.emit('downloadCircles', allCircles, socket.id);

        // place circle at all other socket screens
        socket.broadcast.emit('uploadCircle', playerCircle);
        
        // place all food at all players' screens
        socket.emit('displayFood', allFood);
    });

    // broadcasts & moves circle on other people's socket
    socket.on('moveMouse', function(data) {
        socket.broadcast.emit('moveCircles', data, socket.id);

        // collision detection, checks with movement
        const circle = allCircles.find(element => element._id == socket.id);
        if (circle) {
            allFood.forEach(element => {
                
                xBound = element.x - data.x;
                yBound = element.y - data.y;
                
                d = Math.sqrt(Math.pow(xBound, 2) + Math.pow(yBound, 2));
                r = element.size/2 + circle.size/2;

                if (d<=r) {
                    console.log('food collision');
                    // remove food and add point (or mass)

                    const index = allFood.indexOf(element);
                    allFood.splice(index, 1);
                    console.log(`${food._id} food removed!`)
                    
                    io.sockets.emit('removeFood', element)

                    if (allFood.length < 100) {
                        newFood = new Food()
                        allFood.push(newFood)
                        io.sockets.emit('addFood', newFood)
                    };  
                };
            });
        };
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