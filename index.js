var server = require("./server");
var router = require("./router");

var user = require("./model/user");
var store = require("./model/store");

var handle = {}
handle["/login"] = user.login;
handle["/listStore"] = store.list;

server.start(router.route, handle);