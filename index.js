var server = require("./server");
var router = require("./router");

var user = require("./model/user");
var store = require("./model/store");
var room = require("./model/room");

var handle = {}
handle["/login"] = user.login;
handle["/listStore"] = store.list;
handle["/createRoom"] = room.create;

server.start(router.route, handle);