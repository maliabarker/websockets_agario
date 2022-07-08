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
    };
};

// constants to start game
const initialScreen = document.getElementById('initialScreen');
const gameScreen = document.getElementById('gameScreen');
const startBtn = document.getElementById('joinGameBtn');
const usernameInput = document.getElementById('username');
const circleContainer = document.getElementById("circleContainer");


startBtn.addEventListener('click', startGame);

function allowMovement() {
    document.onmousemove = function(e) {
        // console.log('moving')
        // circle.style.left = e.pageX + 'px';
        // circle.style.top = e.pageY + 'px';
        socket.emit('moveMouse', {x: e.pageX, y: e.pageY})
    };
}

function startGame() {

    const username = usernameInput.value;
    console.log(`${username} joined the game`);

    // get rid of username input screen
    initialScreen.style.display = 'none';
    gameScreen.style.display = 'block';


    // Creating a new circle and emitting to server
    var circle = new Circle();
    socket.emit('createPlayer', circle, username);

    socket.on('downloadCircles', function(allCircles, socketId) {
        allCircles.forEach(function(element) {
            console.log(socketId);
            if (element._id == socketId){
                console.log('element found')
                var circleEle = document.createElement('div');
                circleEle.setAttribute('id', element._id);
                circleEle.setAttribute(
                    'style',
                    `display: block;
                        position: absolute; 
                        transform: translate(-50%, -50%);
                        height: ${element.size}px;
                        width: ${element.size}px;
                        border-radius: 50%;
                        background-color: hsl(${element.hue}, 100%, 50%);`
                );
                
                circleContainer.appendChild(circleEle);
                const onMouseMove = (e) => {
                    circleEle.style.left = e.pageX + 'px';
                    circleEle.style.top = e.pageY + 'px';
                    socket.emit('moveMouse', {x: e.pageX, y: e.pageY})
                }

                document.addEventListener('mousemove', onMouseMove);

            } else{
                var circleEle = document.createElement('div');
                circleEle.setAttribute('id', element._id);
                circleEle.setAttribute(
                    'style',
                    `display: block;
                        position: absolute; 
                        transform: translate(-50%, -50%);
                        height: ${element.size}px;
                        width: ${element.size}px;
                        border-radius: 50%;
                        background-color: hsl(${element.hue}, 100%, 50%);`
                );
                
                circleContainer.appendChild(circleEle);
            };
        });
    });
    
    
    socket.on('uploadCircle', function(playerCircle) {
        var circleEle = document.createElement('div');
        circleEle.setAttribute('id', playerCircle._id);
        circleEle.setAttribute(
            'style',
            `display: block;
                position: absolute; 
                transform: translate(-50%, -50%);
                height: ${playerCircle.size}px;
                width: ${playerCircle.size}px;
                border-radius: 50%;
                background-color: hsl(${playerCircle.hue}, 100%, 50%);`
        );
        
        circleContainer.appendChild(circleEle);
    });
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

socket.on('moveCircles', function(coords, socketId) {
    console.log(socketId)

    if (document.body.contains(document.getElementById(socketId))) {
        console.log('Element found')
        var element = document.getElementById(socketId)
        element.style.left = `${coords.x}px`;
        element.style.top = `${coords.y}px`;
    };
});

// delete circle on disconnect
socket.on('disconnectPlayer', function(socket_id) {
    if (document.body.contains(document.getElementById(socket_id))) {
        var player = document.getElementById(socket_id)
        player.remove()
    };
});

