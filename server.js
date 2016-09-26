var express = require('express');
var path    = require('path');
var request = require('request');
var io      = require('socket.io');

var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

var server = app.listen(3000, function () {
  console.log('Keyboard Racer server listening on port 3000!');
});

var listener = io.listen(server);

listener.sockets.on('connection', function(socket){
    console.log('connected');
    socket.on('opponent:typePos', function(data){
        socket.broadcast.emit('opponent:typePos', data);
    })
    socket.on('disconnect', function(){
        console.log('disconnected');
    })

})

