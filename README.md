# Copycat Agar.io
This is a copy-cat version of agar.io, an web game inspired by the way bacteria grow on agar plates in laboratories. Play here https://agar.io/

## How it Works—Playing the Game
Players load in as a small circle and grow by consuming food or other players. Each consumption adds the mass of the consumed material to the score.

To play, clone this repo and install all dependencies in the packages.json file. Then simply run nodemon and you're good to go!

## Why Use Websockets?
Websockets are used to update movement and food consumption in real time. By using websockets, players are able to accurately play with one another without any delays.

## How it Works—The Code
Players begin with a start screen. When a username is submitted in the input, the game is instantiated using the startGame function on the client side—which includes creating the player circle object and tracking mouse movement on the client side. This also calls a handful of functions on the server side such as loading the player circle on their screen and all other players' screens, broadcasting a connection message to all other players, and displaying all food on all players' screens. 

A mouse move event tracks the coordinates of each players' circles on the client side which are then sent to the server side to handle. If a circle is instantiated (meaning the player has submitted a username and loaded into the game), then a few things happen. First, the player's movement is emitted to all other players. Then collision detection is instantiated by tracking the coordinates of every food circle and player circle.

If collision occurs for food, events are emitted to the client side including: the food circle is removed, points are added to the player, the player's circle grows, and a new food piece is added to the game screen. 

If a player disconnects, the server sends a function to the client side to remove the player from all screens.