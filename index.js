var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {};

var hasName = function hasName(name) {
  for (var key in people) {
    if (people[key] === name) {
      return true;
    }
  }
  return false;
};

io.on('connection', function(client) {

  client.on("join", function(name) {
    if (hasName(name)) {
      client.emit("join-response", false, name);
    } else {
      people[client.id] = name;
      client.emit("join-response", true, name);
      io.sockets.emit("message", undefined, name + " has joined the chat room.", Date.now()); // undefined means global message.
      io.sockets.emit("update-people", people);
    }
  });

  client.on("message", function(msg){
    io.sockets.emit("message", people[client.id], msg, Date.now());
  });

  client.on("disconnect", function(){
    if (people[client.id]) {
      io.sockets.emit("message", undefined, people[client.id] + " has left the chat room.", Date.now()); // undefined means global message.
      delete people[client.id];
      io.sockets.emit("update-people", people);
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});