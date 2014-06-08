var test = require("../test").test;

var data = JSON.stringify({
    token : "8e78e650-ef10-11e3-b2dd-0b0144f9b7e1",
    time : Math.round((new Date).getTime()/1000),
    name : "test room",
    FBIds : ["123","456"]
});

test("/createRoom",data,function(data){
	console.log(data);
});
