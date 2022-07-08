// websocket script
var socket = io();

// creating a circle object
class Circle {
    // add all attributes
    constructor(socketId, playerUsername) {
        this._id = socketId;
        this.username = playerUsername;
        this.x = Math.floor(Math.random() * window.screen.width);
        this.y = Math.floor(Math.random() * window.screen.height);
        this.hue = Math.floor(Math.random() * 360);
        this.size = 20;
    }

    // // method to display circle
    // display() {

    // }

    // // method to move circle
    // move() {

    // }
};

// constants to start game
const initialScreen = document.getElementById('initialScreen');
const gameScreen = document.getElementById('gameScreen');
const startBtn = document.getElementById('joinGameBtn');
const usernameInput = document.getElementById('username');
const circleContainer = document.getElementById("circleContainer");

startBtn.addEventListener('click', startGame);

function startGame() {

    const username = usernameInput.value;
    console.log(`${username} joined the game`);

    initialScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    // socket.emit('connect msg', username)

    // Creating a new circle and emitting to server
    var circle = new Circle();
    console.log(circle);
    socket.emit('createPlayer', circle, username);

    socket.emit('drawGame');
    socket.emit('placePlayer');
};



// ——————————————————————————————————————————————————————

// will emit connection message to all users (sockets)
socket.on('connectMsg', function(msg) {
    console.log(`${msg} connected`);
    document.getElementById("connect-msg").innerHTML = msg + ' just connected';

    // TODO: make sure connection message does not move page down (move circles)
    setTimeout(function(){
        document.getElementById("connect-msg").innerHTML = '';
    }, 3000);
});

// display all circles 
socket.on('drawGame', function(circles) {
    console.log(circles.length)
    circles.forEach(element => {
        console.log(element.playerUsername)
        // draw circles on gamescreen
        var circle = document.createElement('div');
        circle.setAttribute('id', element.playerUsername);
        // background-color: hsl(${element.hue}, 100, 50);
        console.log(`beep boop ${element.size}`)
        circle.setAttribute(
            'style',
            `display: block;
             position: absolute; 
             transform: translate(-50%, -50%);
             height: ${element.size}px;
             width: ${element.size}px;
             border-radius: 50%;
             background-color: red;`
        );
        
        // circle.style.backgroundColor = `hsl(${element.hue}, 100, 50)`
        // circle.style.position = 'absolute';
        // circle.style.transform = 'translate(-50%, -50%)';
        // circle.style.height = element.size;
        // circle.style.width = element.size;
        
        circleContainer.appendChild(circle);

        const onMouseMove = (e) => {
            circle.style.left = e.pageX + 'px';
            circle.style.top = e.pageY + 'px';
        }
        document.addEventListener('mousemove', onMouseMove);
    });
});

// socket.on('drawGame', function() {

// })

socket.on('placePlayer', function() {

})

// socket.on('new circle', function() {
//     var circleContainer = document.getElementById("circle-container");
//     var circle = document.createElement('div');
//     circle.setAttribute('id', 'user-circle');
//     circleContainer.appendChild(circle);
//     const onMouseMove = (e) => {
//         circle.style.left = e.pageX + 'px';
//         circle.style.top = e.pageY + 'px';
//     }
//     document.addEventListener('mousemove', onMouseMove);
// });

// delete circle on disconnect

