var express = require('express');
var app = express();
var http = require('http').Server(app)
var path    = require("path");
var io = require('socket.io')(http);

const PORT = 3000;

var players = {};
var player_positions = {};

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/public/index.html'))
});

io.on('connection', function(socket){
  console.log('a user connected');
  players[socket.id] = socket;
  player_positions[socket.id] = {'x':0,'y':0,'z':0};
 //  for(var key in players) {
 //  	// var value = dict[key];
 //  	console.log(key) 
	// }

  socket.on('disconnect', function(){
    console.log('user disconnected');
    delete players[socket.id];
    delete player_positions[socket.id];
  });
  socket.on('gameStart', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('playerStatus', function(info){
    // console.log('message: ' + JSON.stringify(info));
    player_positions[info['id']] = {
    	'x':info['x'],
    	'y':info['y'],
    	'z':info['z']
    }
    io.emit('updatePlayers', info);
  });
  
});

http.listen(PORT, () => { console.log('Listening on port '+ PORT)});