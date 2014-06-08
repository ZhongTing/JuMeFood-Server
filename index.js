var server = require("./server");
var router = require("./router");

var user = require("./model/user");
var store = require("./model/store");
var room = require("./model/room");
var invitation = require("./model/invitation");

var handle = {}
handle["/login"] = user.login;
handle["/listStore"] = store.list;
handle["/createRoom"] = room.create;
handle["/listRooms"] = room.list;
handle["/listRoomMembers"] = room.members;
handle["/listInvited"] = invitation.list;
handle["/acceptInvitation"] = invitation.accept;

server.start(router.route, handle);