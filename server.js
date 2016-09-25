var express = require('express');
var path    = require('path');
var request = require('request');
var io      = require('socket.io');

var app = express();

var server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

var listener = io.listen(server);