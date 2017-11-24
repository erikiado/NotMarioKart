var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

io.set('transports', ['websocket']);

const PORT = 5000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

let gameIsStarted = false;
let gameStartedTimestamp = null;

// key is socket.id
// fields: id, position, rotation
let players = {};

io.on('connection', function(socket) {
    console.log('[connection]', socket.id);
    const allPlayers = Object.values(players);
    socket.emit('all-players', allPlayers);
    const newPlayer = {
        id: socket.id,
        position: {
            x: 0, y: 0, z: 0
        },
        rotation: {
            x: 0, y: 0, z: 0
        }
    };
    players[socket.id] = newPlayer;
    socket.broadcast.emit('player-joined', newPlayer);

    socket.on('disconnect', function() {
        console.log('[disconnect]', socket.id);
        delete players[socket.id];
        io.emit('player-left', socket.id);
    });

    socket.on('update-player', function(player) {
        console.log('[update-player]', socket.id);
        const id = socket.id;
        const position = player.position;
        const rotation = player.rotation;
        socket.broadcast.emit('update-player', {
            id: id,
            position: position,
            rotation: rotation
        });
        // TODO: Check if checkpoint is reached
        // TODO: If checkpoint already reached, check if finish is reached
        // TODO: If finished, io.emit('', ...)
    });

    socket.on('player-ready', function() {
        console.log('[player-ready]', socket.id)
        // TODO: marks this socket player as ready, if he has a name
    });

    socket.on('player-name', function(name) {
        // TODO: add name to current socket player
        console.log('[player-name]', name);
        players[socket.id]['name'] = name;
    });
});

http.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});