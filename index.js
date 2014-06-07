var server = require("./server");
var router = require("./router");

var user = require("./model/user");

var handle = {}
handle["/login"] = user.login;

server.start(router.route, handle);