var test = require("./test").test;

var data = JSON.stringify({
    token : "6574a9f0-ee6c-11e3-b627-27d2cf4ed1f8",
    time : Math.round((new Date).getTime()/1000),
    name : "test room",
    FBIds : ["123","456"]
});

test("/createRoom",data,function(data){
	console.log(data);
});