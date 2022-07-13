// class Circle {
//     // add all attributes
//     constructor(socketId, playerUsername) {
//         this._id = socketId;
//         this.username = playerUsername;
//         this.x = Math.floor(Math.random() * window.screen.width);
//         this.y = Math.floor(Math.random() * window.screen.height);
//         this.hue = Math.floor(Math.random() * 360);
//         this.size = 30;
//     };
// };

class Food {
    // add all attributes
    constructor() {
        this._id = Math.floor(Math.random()*99999);
        this.x = Math.floor(Math.random() * 1512);
        this.y = Math.floor(Math.random() * 982);
        this.hue = Math.floor(Math.random() * 360);
        this.size = Math.floor(Math.random() * 10) + 5;
    };
};

// module.exports = Circle;
module.exports = Food;