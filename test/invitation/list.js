var test = require("../test").test;

var data = JSON.stringify({
    token : "123",
    // token : "8e78e650-ef10-11e3-b2dd-0b0144f9b7e1"
});

test("/listInvited",data,function(data){
	console.log(data);
});
