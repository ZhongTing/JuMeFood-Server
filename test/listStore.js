var test = require("./test").test

var data = JSON.stringify({
    token : "6574a9f0-ee6c-11e3-b627-27d2cf4ed1f8",
    tag : 1
});

test("/listStore",data,function(data){
	console.log(data);
});