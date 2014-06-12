var test = require("../test").test;

var data = JSON.stringify({
    // token : "123",
    // token : "8e78e650-ef10-11e3-b2dd-0b0144f9b7e1"
    token:"9ce0ff50-f147-11e3-886e-8d73978141a4",
    rid : 1
});

test("/listRoomAdvices",data,function(data){
	console.log(data);
});
