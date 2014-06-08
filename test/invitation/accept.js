var test = require("../test").test;

var data = JSON.stringify({
    token : "123",
    rid : 2
});

test("/acceptInvitation",data,function(data){
	console.log(data);
});
test("/listInvited",data,function(data){
	console.log(data);
});
