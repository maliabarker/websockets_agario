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
        this.size = 30;
    };
};

// constants to start game
const initialScreen = document.getElementById('initialScreen');
const gameScreen = document.getElementById('gameScreen');
const startBtn = document.getElementById('joinGameBtn');
const usernameInput = document.getElementById('username');
const circleContainer = document.getElementById("circleContainer");
var points = 0;


startBtn.addEventListener('click', startGame);

// —————————————————————————————————————————————————————— //

function startGame() {

    const username = usernameInput.value;
    console.log(`${username} joined the game`);
    console.log(window.screen.width)
    console.log(window.screen.height)

    // get rid of username input screen
    initialScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    // Creating a new circle and emitting to server
    var circle = new Circle();
    socket.emit('createPlayer', circle, username);

    // download all circles (including player) onto the socket screen
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
                    element.x = e.pageX
                    element.y = e.pageY
                    circleEle.style.left = e.pageX + 'px';
                    circleEle.style.top = e.pageY + 'px';

                    // circleEle.style.transform = `translate(${e.pageX}px,${e.pageY}px)`
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
    
    // upload circle to all other socket screens
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
                background-color: hsl(${playerCircle.hue}, 100%, 50%);
                `
        );
        
        circleContainer.appendChild(circleEle);
    });

    // display food to all players
    socket.on('displayFood', function(food) {
        foodContainer = document.getElementById('foodContainer')
        food.forEach(function(element) {
            console.log(element)
            var foodDiv = document.createElement('div');
            foodDiv.setAttribute('id', element._id)
            foodDiv.setAttribute(
                'style',
                `display: block;
                    position: absolute; 
                    transform: translate(-50%, -50%);
                    height: ${element.size}px;
                    width: ${element.size}px;
                    left: ${element.x}px;
                    top: ${element.y}px;
                    border-radius: 50%;
                    background-color: hsl(${element.hue}, 100%, 50%);`
            );
            foodContainer.appendChild(foodDiv)
        });
    });
};


// —————————————————————————————————————————————————————— //


// will emit connection message to all users (sockets)
socket.on('connectMsg', function(msg) {
    console.log(`${msg} connected`);
    document.getElementById("connect-msg").innerHTML = msg + ' just connected';

    // TODO: make sure connection message does not move page down (move circles)
    setTimeout(function(){
        document.getElementById("connect-msg").innerHTML = '';
    }, 3000);
});

// move circles with coordinate data from mousemove
socket.on('moveCircles', function(coords, circle) {
    if (document.body.contains(document.getElementById(circle._id))) {
        var element = document.getElementById(circle._id)
        // element.style.transform = `translate(${coords.x}px,${coords.y}px)`
        circle.x = coords.x
        circle.y = coords.y
        element.style.left = `${coords.x}px`;
        element.style.top = `${coords.y}px`;
    };
});

// remove food
socket.on('removeFood', function(foodObj) {
    var food = document.getElementById(foodObj._id)
    if (food) {
        console.log(`removing ${foodObj._id}`)
    }
    food.remove()
});

// add new food
socket.on('addFood', function(newFood) {
    foodContainer = document.getElementById('foodContainer')
    var foodDiv = document.createElement('div');
    console.log(`adding ${newFood._id}`)
    foodDiv.setAttribute('id', newFood._id)
    foodDiv.setAttribute(
        'style',
        `display: block;
            position: absolute; 
            transform: translate(-50%, -50%);
            height: ${newFood.size}px;
            width: ${newFood.size}px;
            left: ${newFood.x}px;
            top: ${newFood.y}px;
            border-radius: 50%;
            background-color: hsl(${newFood.hue}, 100%, 50%);`
    );
    foodContainer.appendChild(foodDiv);
})

// add points only on socket's screen
socket.on('addPoint', function(count) {
    points += count;
    pointDiv = document.getElementById('pointsCount');
    pointDiv.innerHTML = points;
});

// grow circle on all other screens
socket.on('addMass', function(circle) {
    var circleDiv = document.getElementById(circle._id);
    circleDiv.style.height = circle.size + 'px'
    circleDiv.style.width = circle.size + 'px'
});

// delete circle on disconnect
socket.on('disconnectPlayer', function(socket_id) {
    if (document.body.contains(document.getElementById(socket_id))) {
        var player = document.getElementById(socket_id)
        player.remove()
    };
});