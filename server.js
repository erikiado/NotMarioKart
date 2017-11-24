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
let boxes;
let readys = [];

io.on('connection', function(socket) {
    console.log('[connection]', socket.id);
    socket.emit('all-players', Object.values(players));
    const playersLength = Object.values(players).length;
    const newPlayer = {
        id: socket.id,
        playerNum: playersLength,
        ready: false,
        lap: 0,
        position: {
            x: 0, y: 0, z: 0
        },
        rotation: {
            x: 0, y: 0, z: 0
        }
    };
    if(playersLength != 0){
        socket.emit('receive-boxes', boxes);
    }
    if(readys.length > 2){
        socket.emit('spectator');
    } else {
        players[socket.id] = newPlayer;
        socket.broadcast.emit('player-joined', newPlayer);

        socket.on('disconnect', function() {
            console.log('[disconnect]', socket.id);
            delete players[socket.id];
            delete readys[socket.id];

            io.emit('player-left', socket.id);
        });

        socket.on('update-player', function(player) {
            // console.log('[update-player]', socket.id);
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

        socket.on('player-ready', function(name) {
            console.log('[player-ready]', name)
            players[socket.id]['name'] = name;
            players[socket.id].ready = true;
            readys.push(socket.id)
            if(readys.length == 2){
                io.emit('start-race');
            }
            // TODO: marks this socket player as ready, if he has a name
        });

        socket.on('player-lap', function(lap) {
            players[socket.id].lap = lap;
            if(lap == 2){
                socket.broadcast.emit('race-over')
                readys = [];
            }
            // TODO: marks this socket player as ready, if he has a name
        });

        socket.on('send-boxes', function(boxs){
            boxes = boxs;
        })
    }

});


http.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});
