// script for moving circle with mouse
let circle = document.getElementById('circle');
const onMouseMove = (e) => {
    circle.style.left = e.pageX + 'px';
    circle.style.top = e.pageY + 'px';
}
document.addEventListener('mousemove', onMouseMove);


// websocket script
var socket = io();

socket.on('new connection', function(msg) {
    console.log('SOMETHING')
    document.getElementById("connect-msg").innerHTML = msg + ' just connected';

    setTimeout(function(){
        document.getElementById("connect-msg").innerHTML = '';
    }, 3000);

});

