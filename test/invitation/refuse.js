var test = require("../test").test;

var data = JSON.stringify({
    token : "123",
    rid : 3
});

test("/refuseInvitation",data,function(data){
	console.log(data);
});