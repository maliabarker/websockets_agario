// creating a circle object
class Circle {
    // add all attributes
    constructor(socketId) {
        this._id = socketId;
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

// ——————————————————————————————————————————————————————

// websocket script
var socket = io();

// will only emit to current user
socket.on('connect message', function(msg) {
    console.log(`${msg} connected`);
    document.getElementById("connect-msg").innerHTML = msg + ' just connected';

    // TODO: make sure connection message does not move page down (move circles)
    setTimeout(function(){
        document.getElementById("connect-msg").innerHTML = '';
    }, 3000);
});

// Creating a new circle and emitting to server
var circle = new Circle();
console.log(circle);
socket.emit('new circle', circle);

// // display all circles 
// socket.on('draw circles', function(circles) {
//     circles.array.forEach(element => {
//         console.log(element)
//     });
// })

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

